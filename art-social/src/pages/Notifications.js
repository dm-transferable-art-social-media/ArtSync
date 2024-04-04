import React, { useEffect, useState } from "react";
import { getNotifications } from "../lib/bsky.ts";
import { personPlusFilled, chatFilled, repost, heartFilled } from "./assets/Icons.js";
import style from "./styles/notifications.module.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const [data, cursor] = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const notificationType = {
    follow: personPlusFilled,
    reply: chatFilled,
    repost: repost,
    like: heartFilled
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Notifications</h2>
      <div>
        {notifications.length > 1 ? (
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Date</th>
                <th>Type</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification, index) => (
                <tr key={index} className={style.notificationRow}>
                  <td>{notificationType[notification.reason]}</td>
                  <td>
                    <span className={style.notificationDate}>{new Date(notification.record.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td>
                    <span> {"   " + notification.reason}</span>
                  </td>
                  <td>
                    <div className={style.notificationDetails}>
                      <span className={style.notificationAuthor}>From: @{notification.author.handle}</span>
                      {notification.reason === "reply" && (
                        <span className={style.notificationText}>{'"' + notification.record.text + '"'}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) :
          (<span>You have no new notifications.</span>)}
      </div>
    </div>
  );
};

export default Notifications;