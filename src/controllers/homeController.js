const homeController = {
  index: (req, res) => {
    res.json({ message: 'Welcome to the API' });
  }
};

module.exports = homeController; 