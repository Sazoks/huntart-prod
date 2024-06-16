import { FC, useState } from "react";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";

import "./FeedsSwitcher.scss"

import { fetchNewArts, fetchPopularArts, fetchSubscriptionsArts, selectFeedName, setFeedName } from "../../../app/model/slices/artsSlice";
import { selectIsAuth } from "../../../app/model/slices/authSlice";

interface FeedsSwitcherProps {
  feedsNames?: string[];
}

const FeedsSwitcher:FC<FeedsSwitcherProps> = ({feedsNames}) => {

  const isAuth = useSelector(selectIsAuth);
  const activeFeedName = useSelector(selectFeedName);

  const dispatchThunk  = useDispatch<ThunkDispatch>();
  const dispatch = useDispatch();

  // const [activeFeedName, setActiveFeedName] = useState<string>("новые работы");

  const onFeedChange = (feedName: string) => {
    // setActiveFeedName(feedName);
    dispatch(setFeedName(feedName))
    switch (feedName) {
      case 'новые работы':
        dispatchThunk(fetchNewArts());
        break;
      case 'популярное':
        dispatchThunk(fetchPopularArts());
        break;
      case 'подписки':
        dispatchThunk(fetchSubscriptionsArts());
        break;
      default:
        dispatchThunk(fetchNewArts());
    }
  }

  const renderBtns = () => {

    return (
      feedsNames?.map((feedName, i) => {
        return (
          <button key={i}
                  className={clsx('swither__feed-btn', feedName === activeFeedName && 'active',
                  !isAuth && 'swither__feed-btn--not-auth')}
                  name={feedName}
                  onClick={() => onFeedChange(feedName)}>
            {feedName.toUpperCase()}
          </button>
        )
      })
    )
  }

  return (
    <div className="switcher">
      {renderBtns()}
    </div>
  )
}

export default FeedsSwitcher;