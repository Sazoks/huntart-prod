"""
Django settings for hunt_art project.

Generated by 'django-admin startproject' using Django 5.0.2.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from typing import Any
from decouple import (
    Csv,
    config,
)
from pathlib import Path
from datetime import timedelta
from dj_database_url import (
    DBConfig,
    parse as db_url_to_conf,
)


# Main settings.

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config(
    'DJANGO_SECRET_KEY',
    default='9vl-f=e9)s-@lo=cepa-cb^0f*7o1!)7&z^vp&+16wlo',
)

DEBUG = config('DJANGO_DEBUG', cast=bool, default=True)

ROOT_URLCONF = 'hunt_art.urls'

WSGI_APPLICATION = 'hunt_art.wsgi.application'

ASGI_APPLICATION = "hunt_art.asgi.application"

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'users.User'

DJANGO_ALLOW_ASYNC_UNSAFE = True


# Network settings.

ALLOWED_HOSTS = config(
    'DJANGO_ALLOWED_HOSTS',
    cast=Csv(),
    default='localhost',
)
print(ALLOWED_HOSTS)

CORS_ALLOWED_ORIGINS = config(
    'DJANGO_CORS_ALLOWED_ORIGINS',
    cast=Csv(),
    default='http://localhost:8000',
)
print(CORS_ALLOWED_ORIGINS)

CORS_ALLOW_CREDENTIALS = config(
    'DJANGO_CORS_ALLOW_CREDENTIALS',
    cast=bool,
    default=False,
)


# Internationalization settings.

LANGUAGE_CODE = 'ru-RU'

TIME_ZONE = 'Asia/Krasnoyarsk'

USE_I18N = True

USE_TZ = True


# Static and Media files settings.

STATIC_URL = '/static/'

STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'

MEDIA_ROOT = BASE_DIR / 'media'


# Debug panel.

INTERNAL_IPS = [
    'localhost',
]

DEBUG_TOOLBAR_CONFIG = {
    'SHOW_TOOLBAR_CALLBACK': lambda _: DEBUG,
}


# Application definition settings.

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Installed apps.
    'debug_toolbar',
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt',
    'drf_spectacular',
    'drf_spectacular_sidecar',
    'django_filters',

    # Internal apps.
    'apps.users',
    'apps.arts',
    'apps.websockets',
    'apps.chats',
]

if DEBUG:
    INSTALLED_APPS.insert(0, 'daphne')

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # django-cors-headers.
    'debug_toolbar.middleware.DebugToolbarMiddleware',  # django-debug-toolbar.
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


# Database settings.

def _get_default_db_config() -> DBConfig:
    db_dsn_template: str | None = config('DB_DSN', default=None)
    
    if db_dsn_template is None:
        return db_url_to_conf(f'sqlite:///{BASE_DIR}/db.sqlite3')
    
    return db_url_to_conf(
        db_dsn_template.format(
            username=config('DB_USER'),
            password=config('DB_PASSWORD'),
            host=config('DB_HOST'),
            port=config('DB_PORT'),
            db_name=config('DB_NAME'),
        )
    )

DATABASES = {
    'default': _get_default_db_config(),
}


# Password validation settings.

if not DEBUG:
    AUTH_PASSWORD_VALIDATORS = [
        {
            'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
        },
    ]


# JWT Auth settings.

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
    "UPDATE_LAST_LOGIN": True,
}


# API auto-documentation settings.

SPECTACULAR_SETTINGS = {
    'TITLE': 'HuntArt',
    'DESCRIPTION': 'Социальная сеть для художников',
    'VERSION': '0.1.0',
    'SERVE_INCLUDE_SCHEMA': False,
    # Вместо использования CDN для Swagger'a используем загруженную статику.
    'SWAGGER_UI_DIST': 'SIDECAR',
    'SWAGGER_UI_FAVICON_HREF': 'SIDECAR',
    'REDOC_DIST': 'SIDECAR',
    'SWAGGER_UI_SETTINGS': {
        'deepLinking': True,
        'persistAuthorization': True,
        'filter': True,
    },
    'COMPONENT_SPLIT_REQUEST': True,
    # 'SERVE_PERMISSIONS': ('utils.permissions.IsSuperUser',),
    # 'SERVE_AUTHENTICATION': ('rest_framework.authentication.SessionAuthentication',),
}


# Django REST Framework settings.

REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

# Django Channels Layers settings.

def _get_default_channel_layers_config() -> dict[str, Any]:
    redis_dsn: str | None = config('REDIS_DSN', default=None)

    if redis_dsn is None:
        return {
            'BACKEND': 'channels.layers.InMemoryChannelLayer',
        }
    
    channel_layer_dsn = redis_dsn.format(
        host=config('REDIS_HOST'),
        username=config('REDIS_USER'),
        password=config('REDIS_PASSWORD'),
        db=config('REDIS_CHANNELS_LAYER_DB'),
    )
    
    return {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [channel_layer_dsn],
        },
    }

CHANNEL_LAYERS = {
    "default": _get_default_channel_layers_config(),
}
