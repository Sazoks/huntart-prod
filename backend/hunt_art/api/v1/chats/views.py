from typing import (
    Collection,
    Type,
)

from django.db.models import QuerySet

from rest_framework import mixins
from rest_framework.permissions import (
    BasePermission,
    IsAuthenticated,
)
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.serializers import Serializer
from rest_framework.viewsets import GenericViewSet

from apps.chats.models import (
    Chat,
    PersonalChatData,
    GroupChatData,
    ChatMember,
    ChatMessage,
)
from apps.users.models import User

from .pagination import ChatPagination, ChatMessagePagination
from .serializers import ShortChatSerializer, ChatMessageSerializer
from .openapi import chats_openapi, chat_messages_openapi


class ChatsViewSet(
    mixins.ListModelMixin,
    GenericViewSet,
):
    pagination_class = ChatPagination
    permissions_map: dict[str, Collection[BasePermission]] = {
        "list": (IsAuthenticated(), ),
    }

    def get_permissions(self) -> Collection[BasePermission]:
        return self.permissions_map.get(self.action, ())

    def get_serializer_class(self) -> Type[Serializer] | None:
        match self.action:
            case "list":
                return ShortChatSerializer
    
    def get_queryset(self) -> QuerySet[Chat]:
        """Чаты аутентифицированного пользователя"""
        return (
            self.request.user.chats
            .select_related("group_chat_data", "personal_chat_data")
            .prefetch_related("users")
            .all()
        )
    
    @chats_openapi.get("list")
    def list(self, request: Request, *args, **kwargs) -> Response:
        return super().list(request, *args, **kwargs)
    
    @action(methods=("post", ), detail=True, url_path="read-all-messages")
    def read_all_messages(self, request: Request, **kwargs) -> Response:
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        other_user = User.objects.filter(pk=self.kwargs[lookup_url_kwarg]).first()

        print(f'Other user: {other_user.username}, pk: {other_user.pk}')

        chat = list(
            self.request.user.chats
            .filter(chat_type=Chat.ChatType.PERSONAL)
            .intersection(
                other_user.chats
                .filter(chat_type=Chat.ChatType.PERSONAL)
            )
        )[0]

        print(f'Chat pk: {chat.pk}')

        chat_member = ChatMember.objects.filter(chat=chat, user=request.user).first()
        print(f'Member pk: {chat_member.pk}')

        last_message = ChatMessage.objects.filter(chat=chat).order_by('-created_at').first()
        print(f'Message: (created_at) {last_message.created_at}, (pk) {last_message.pk}, (chat) {last_message.chat.pk}, (user) {last_message.user.pk}')

        print(f'Read before (user: {chat_member.user.pk}, pk: {chat_member.pk}) {chat_member.read_before}')
        chat_member.read_before = last_message.created_at
        chat_member.save()
        print(f'Read before (user: {chat_member.user.pk}, pk: {chat_member.pk}) {chat_member.read_before}')

        return Response(status=200)
    

class ChatMessagesViewSet(
    mixins.ListModelMixin,
    GenericViewSet,
):
    serializer_class = ChatMessageSerializer
    pagination_class = ChatMessagePagination
    permissions_map: dict[str, Collection[BasePermission]] = {
        "list": (IsAuthenticated(), ),
    }

    def get_queryset(self) -> QuerySet[ChatMessage]:
        other_user = User.objects.filter(pk=self.kwargs["chat_pk"]).first()
        chat = list(
            self.request.user.chats
            .filter(chat_type=Chat.ChatType.PERSONAL)
            .intersection(
                other_user.chats
                .filter(chat_type=Chat.ChatType.PERSONAL)
            )
        )[0]

        return ChatMessage.objects.filter(chat=chat).order_by('-created_at')

    @chat_messages_openapi.get("list")
    def list(self, request: Request, *args, **kwargs) -> Response:
        return super().list(request, *args, **kwargs)
