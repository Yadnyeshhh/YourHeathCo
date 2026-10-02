const Notification = require('../models/Notification');

exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : req.admin ? req.admin._id : null; 
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    // Determine if it's admin or user. Since auth middleware uses `req.user`, we check it.
    
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { isRead: true });
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    next(err);
  }
};
