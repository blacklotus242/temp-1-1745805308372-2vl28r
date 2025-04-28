export function sendLocalNotification(title, body) {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications.');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification(title, { body });
      }
    });
  }
}