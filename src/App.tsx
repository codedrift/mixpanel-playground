import mixpanel from "mixpanel-browser";
import React, { useEffect } from "react";
import { Link, Route, Switch, useHistory, useLocation } from "react-router-dom";
import "./App.module.css";

export default function TrackLocation() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    mixpanel.track("Page view", {
      path: pathname,
      search: search,
    });
  }, [pathname, search]);

  return null;
}

function initMixpanel() {
  const id = process.env.REACT_APP_MIXPANEL_ID;
  const userId = "abc-foo-123";
  console.log("Init mixpanel", {
    id,
    userId,
  });
  if (!id) {
    console.warn("Mixpanel not initialized");
    return;
  }
  mixpanel.init(id, {
    debug: true,
    ignore_dnt: true,
  });
  // sets relation between system userid and generated userid
  mixpanel.identify(userId);
  // Use special properties to set name and email
  mixpanel.people.set({ $name: "Peter", $email: "peter@example.com" });
  mixpanel.people.set("Status", "Geiler Typ");
  mixpanel.people.increment("Mixpanel initialized count");
  mixpanel.track("Page loaded", {
    loadtime: 1337,
  });
}

initMixpanel();

enum TrackingAction {
  INVITE_USER = "Invite user",
  QUICK_GO_TO_FEATURE = "Quick nav go to feature",
  UPGRADE = "Upgrade to premium",
}

type TrackedButtonProps = {
  title: string;
  trackingAction: TrackingAction;
  trackingMetaData?: Record<string, string>;
  onClick?: () => unknown;
};

const TrackedButton: React.FC<TrackedButtonProps> = ({
  title,
  children,
  trackingAction,
  onClick,
}) => {
  const { pathname } = useLocation();

  const handleClick = () => {
    alert("Button clicked: " + trackingAction);

    mixpanel.track("Button clicked", {
      action: trackingAction,
      title,
      path: pathname,
    });
    if (onClick) {
      onClick();
    }
  };

  return (
    <button onClick={handleClick}>
      {title}
      {children}
    </button>
  );
};

function Home() {
  const history = useHistory();
  const handleClick = () => {
    history.push("/feature");
  };
  return (
    <>
      <h2>Home</h2>
      <TrackedButton
        onClick={handleClick}
        title="Go to Feature"
        trackingAction={TrackingAction.QUICK_GO_TO_FEATURE}
      />
    </>
  );
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return (
    <>
      <h2>Users</h2>
      <TrackedButton
        title="Invite user"
        trackingAction={TrackingAction.INVITE_USER}
        trackingMetaData={{ type: "admin" }}
      />
    </>
  );
}

function FeaturePage() {
  return (
    <>
      <h2>FeaturePage</h2>
      <TrackedButton
        title="Try premium 30 days for free!"
        trackingAction={TrackingAction.UPGRADE}
      />
    </>
  );
}

export function App() {
  return (
    <div>
      <TrackLocation />
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
          <li>
            <Link to="/feature">Feature</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route path="/feature">
          <FeaturePage />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </div>
  );
}
