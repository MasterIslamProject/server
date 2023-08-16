"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _auth = _interopRequireDefault(require("./auth"));

var _user = _interopRequireDefault(require("./user"));

var _admin = _interopRequireDefault(require("./admin"));

var _activities = _interopRequireDefault(require("./activities"));

var _trending = _interopRequireDefault(require("./trending"));

var _trendingReact = _interopRequireDefault(require("./trending-react"));

var _trendingReactComment = _interopRequireDefault(require("./trending-react-comment"));

var _followers = _interopRequireDefault(require("./followers"));

var _report = _interopRequireDefault(require("./report"));

var _quit = _interopRequireDefault(require("./quit"));

var _mailer = _interopRequireDefault(require("./mailer"));

var _contact = _interopRequireDefault(require("./contact"));

var _adaptRequest = _interopRequireDefault(require("./helpers/adapt-request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CustomError = require('./helpers/custom-error');

var cors = require('cors');

const app = (0, _express.default)();
app.use(_bodyParser.default.json());

const fs = require('fs');

const https = require('https'); // const cert = fs.readFileSync('src/certificate.crt')
// const key = fs.readFileSync('src/private.key')


const port = process.env.PORT || 9090; //Middleware

app.use(_express.default.urlencoded({
  extended: true
}));
app.use(_express.default.json());
app.use(cors());
app.get('/.well-known/pki-validation/8500F0D835681EC5795D4277F922F074.txt', (req, res) => {
  res.sendFile('/home/ec2-user/server/src/8500F0D835681EC5795D4277F922F074.txt');
}); // const credentials = {
//   key,
//   cert
// }

function authenticate(req, res, next) {
  const httpRequest = (0, _adaptRequest.default)(req);
  (0, _auth.default)(httpRequest).then(({
    statusCode,
    data
  }) => {
    const bal = JSON.parse(data);

    if (statusCode == 200) {
      return next();
    } else {
      throw new CustomError(bal.status, bal.message);
    }
  }).catch(e => {
    return next(e);
  });
}

app.post('/sendmail', sendmailController);
app.get('/sendmail', authenticate, sendmailController);

function sendmailController(req, res) {
  const httpRequest = (0, _adaptRequest.default)(req);
  (0, _mailer.default)(httpRequest).then(({
    headers,
    statusCode,
    data
  }) => res.set(headers).status(statusCode).send(data)).catch(e => res.status(500).end());
}

app.all('/admin', adminController);
app.post('/admin/add', adminController);
app.post('/admin/auth', adminController);
app.post('/admin/reset', adminController);
app.get('/admin/:id', adminController);
app.get('/admin/?id=:id', adminController);
app.get('/admin/find/?email=:email', adminController);

function adminController(req, res) {
  const httpRequest = (0, _adaptRequest.default)(req);
  (0, _admin.default)(httpRequest).then(({
    headers,
    statusCode,
    data
  }) => res.set(headers).status(statusCode).send(data)).catch(e => res.status(500).end());
}

app.get('/user', authenticate, userController);
app.post('/user/add', userController);
app.post('/user/auth', userController);
app.post('/user/reset', authenticate, userController);
app.post('/user/verify', authenticate, userController);
app.post('/user/reset_password', authenticate, userController); // app.get('/user/:id', authenticate, userController);
// app.get('/user/:category', authenticate, userController);

app.delete('/user/:id', authenticate, userController);
app.get('/user/?category=:category', authenticate, userController);
app.get('/user/?id=:id', authenticate, userController);
app.get('/user/?email=:email', authenticate, userController);
app.get('/user/?verifyemail=:verifyemail', userController);

function userController(req, res) {
  const httpRequest = (0, _adaptRequest.default)(req);
  (0, _user.default)(httpRequest).then(({
    headers,
    statusCode,
    data
  }) => res.set(headers).status(statusCode).send(data)).catch(e => res.status(500).end());
}

app.get('/activities', authenticate, activitiesController);
app.post('/activities/add', activitiesController);
app.delete('/activities/:id', activitiesController);
app.get('/activities?category=:category', authenticate, activitiesController);
app.get('/activities?password=:password', authenticate, activitiesController);
app.get('/activities?cat=:cat&pass=:pass', authenticate, activitiesController);

function activitiesController(req, res) {
  const httpRequest = (0, _adaptRequest.default)(req);
  (0, _activities.default)(httpRequest).then(({
    headers,
    statusCode,
    data
  }) => res.set(headers).status(statusCode).send(data)).catch(e => res.status(500).end());
}

app.get('/follower', authenticate, followerController);
app.post('/follower/add', authenticate, followerController);
app.post('/follower/verify', authenticate, followerController);
app.post('/follower/update-member', authenticate, followerController);
app.post('/follower/update-mentor', authenticate, followerController);
app.post('/follower/update-member-picture', authenticate, followerController);
app.post('/follower/update-member-password', authenticate, followerController);
app.post('/follower/update-mentor-picture', authenticate, followerController);
app.post('/follower/update-mentor-password', authenticate, followerController);
app.delete('/follower/:id', authenticate, followerController);
app.delete('/follower/member/:member_id', authenticate, followerController);
app.delete('/follower/mentor/:mentor_id', followerController);
app.delete('/follower/unfollow/:mid/:memid', followerController);
app.get('/follower?id=:id', authenticate, followerController);
app.get('/follower?mid=:id', authenticate, followerController);
app.get('/follower?memid=:id', authenticate, followerController);
app.get('/follower?m_id=:m_id&mem_id=:mem_id', authenticate, followerController);

function followerController(req, res) {
  const httpRequest = (0, _adaptRequest.default)(req);
  (0, _followers.default)(httpRequest).then(({
    headers,
    statusCode,
    data
  }) => res.set(headers).status(statusCode).send(data)).catch(e => res.status(500).end());
}

app.get('/trending', authenticate, trendingController);
app.post('/trending/add', authenticate, trendingController);
app.post('/trending/update', authenticate, trendingController);
app.delete('/trending/:id', trendingController);
app.get('/trending?id=:id', authenticate, trendingController);
app.get('/trending?category=:category', authenticate, trendingController);

function trendingController(req, res) {
  const httpRequest = (0, _adaptRequest.default)(req);
  (0, _trending.default)(httpRequest).then(({
    headers,
    statusCode,
    data
  }) => res.set(headers).status(statusCode).send(data)).catch(e => res.status(500).end());
}

app.get('/trending-react', authenticate, trendingReactController);
app.post('/trending-react/add', authenticate, trendingReactController);
app.post('/trending-react/verify', authenticate, trendingReactController);
app.post('/trending-react/update-mentor', authenticate, trendingReactController);
app.post('/trending-react/update-mentor-picture', authenticate, trendingReactController);
app.post('/trending-react/update-mentor-password', authenticate, trendingReactController);
app.delete('/trending-react/:id', authenticate, trendingReactController);
app.delete('/trending-react/trending/:trending_id', authenticate, trendingReactController); // app.get('/trending-react/:id', authenticate, trendingReactController);

app.get('/trending-react?id=:id', authenticate, trendingReactController);
app.get('/trending-react?trending_id=:trending_id', authenticate, trendingReactController);
app.get('/trending-react?mentor_id=:mentor_id', authenticate, trendingReactController);

function trendingReactController(req, res) {
  const httpRequest = (0, _adaptRequest.default)(req);
  (0, _trendingReact.default)(httpRequest).then(({
    headers,
    statusCode,
    data
  }) => res.set(headers).status(statusCode).send(data)).catch(e => res.status(500).end());
}

app.get('/trending-react-comment', trendingReactCommentController);
app.post('/trending-react-comment/add', authenticate, trendingReactCommentController);
app.post('/trending-react-comment/update', authenticate, trendingReactCommentController);
app.post('/trending-react-comment/update-picture', authenticate, trendingReactCommentController);
app.post('/trending-react-comment/update-password', trendingReactCommentController); // app.get('/trending-react-comment/:id', authenticate, trendingReactCommentController);

app.get('/trending-react-comment?id=:id', authenticate, trendingReactCommentController);
app.get('/trending-react-comment?react_id=:react_id', authenticate, trendingReactCommentController);
app.get('/trending-react-comment?r_id=:r_id&statux=:statux', authenticate, trendingReactCommentController);
app.get('/trending-react-comment?c_id=:c_id&statux=:statux', authenticate, trendingReactCommentController);
app.get('/trending-react-comment?comment_id=:comment_id', authenticate, trendingReactCommentController);
app.delete('/trending-react-comment/:id', trendingReactCommentController);
app.delete('/trending-react-comment/all/:comment_id', trendingReactCommentController);

function trendingReactCommentController(req, res) {
  const httpRequest = (0, _adaptRequest.default)(req);
  (0, _trendingReactComment.default)(httpRequest).then(({
    headers,
    statusCode,
    data
  }) => res.set(headers).status(statusCode).send(data)).catch(e => res.status(500).end());
}

app.get('/contact', authenticate, contactController);
app.post('/contact/add', authenticate, contactController);
app.get('/contact?id=:id', authenticate, contactController);
app.delete('/contact/:id', authenticate, contactController);

function contactController(req, res) {
  const httpRequest = (0, _adaptRequest.default)(req);
  (0, _contact.default)(httpRequest).then(({
    headers,
    statusCode,
    data
  }) => res.set(headers).status(statusCode).send(data)).catch(e => res.status(500).end());
}

app.get('/quit', authenticate, quitController);
app.post('/quit/add', authenticate, quitController);
app.get('/quit?id=:id', authenticate, quitController);
app.delete('/quit/:id', authenticate, quitController);

function quitController(req, res) {
  const httpRequest = (0, _adaptRequest.default)(req);
  (0, _quit.default)(httpRequest).then(({
    headers,
    statusCode,
    data
  }) => res.set(headers).status(statusCode).send(data)).catch(e => res.status(500).end());
}

app.get('/report', authenticate, reportController);
app.post('/report/add', authenticate, reportController); // app.get('/report/:id', authenticate, reportController);

app.get('/report/?reporter_id=:reporter_id', authenticate, reportController);
app.get('/report?reportee_id=:reportee_id', authenticate, reportController);
app.get('/report?report_category=:report_category', authenticate, reportController);
app.get('/report?id=:id', authenticate, reportController);
app.delete('/report/reporter/:reporter_id', authenticate, reportController);
app.delete('/report/reportee/:reportee_id', authenticate, reportController);
app.delete('/report/:id', authenticate, reportController);

function reportController(req, res) {
  const httpRequest = (0, _adaptRequest.default)(req);
  (0, _report.default)(httpRequest).then(({
    headers,
    statusCode,
    data
  }) => res.set(headers).status(statusCode).send(data)).catch(e => res.status(500).end());
}

app.get('/auth', authenticate, authController); // app.get('/auth/:id', authController);

app.get('/auth?email=:email', authenticate, authController);

function authController(req, res) {
  const httpRequest = (0, _adaptRequest.default)(req);
  (0, _auth.default)(httpRequest).then(({
    headers,
    statusCode,
    data
  }) => res.set(headers).status(statusCode).send(data)).catch(e => res.status(500).end());
}

app.use((err, req, res, next) => {
  if (err) {
    // handleError(err, res);
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  } // console.log(JSON.stringify(req.body))

});
app.listen(port, () => console.log(`Listening on port 9090` + process.env.PORT || 9090)); // const httpServer = https.createServer(credentials, app);
// httpServer.listen(9443)
//# sourceMappingURL=index.js.map