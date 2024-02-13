import React, { Component } from "react";
import Heading from "../Heading";
import { getNotifications } from "../lib/bsky.ts";

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
    };
  }

  componentDidMount() {
    this.fetchNotifications();
  }

  fetchNotifications = async () => {
    try {
      const [data, cursor] = await getNotifications();
      this.setState({ notifications: data });
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  render() {
    return (
      <div>
        <Heading />
        <div>Notifications page</div>
        <div>
          <h2>Notifications</h2>
          <ul>
            {this.state.notifications.map((notification, index) => (
              <li key={index}>
                Notification Type: {notification.reason} <br />
                Notification Author: {notification.author.handle} <br />
                {console.log(notification)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Notifications;
