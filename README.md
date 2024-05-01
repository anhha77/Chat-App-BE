# Chat App

An app that people can connect with other and share content such as posts and comments. This app also includes a range of features like allow users to create and manage their profiles, search for users, add friend them.

## Technologies and tool

<div style="display: flex; justify-content: flex-start; gap: 10px;"><a href="https://react.dev/" target="_blank"><img src="./images/React.png" alt="react" width="40" height="40"/></a><a href="https://redux.js.org/" target="_blank"><img src="./images/Redux.png" alt="redux" width="40" height="40"/></a><a href="https://reactrouter.com/en/main" target="_blank"><img src="./images/react-router-stacked-color.png" alt="react-router-dom" width="40" height="40"/></a><a href="https://react-hook-form.com/" target="_blank"><img src="./images/react-hook-form-logo-only.png" alt="react-hook-form" width="40" height="40"/></a><a href="https://axios-http.com/vi/docs/intro" target="_blank"><img src="./images/images.png" alt="axios" width="40" height="40"/></a><a href="https://mui.com/material-ui/
migration/migration-v4/" target="_blank"><img src="./images/Material UI.png" alt="material ui" width="40" height="40"/></a><a href="https://cloudinary.com/" target="_blank"><img src="./images/cloudinary.png" width="40" height="40"/></a></div>

## Demo Link

- You can use an account that have already created
- Username: kentucky772001@gmail.com
- Password: 1
- Or create a new one

[https://chat-app77.netlify.app](https://chat-app77.netlify.app)

## User Stories

1. As a user, I want to be able to sign up to create my profile

2. As a user, I want to be able to log in (log out) of my account

3. As a user, I want to be able to manage my profile by adding personal information, profile picture, and interests.

4. As a user, I want to be able to search for and add friend with other users

5. As a user, I want to be able to accept/deny following friend requests from other users.

6. As a user, I want to be able to see a list of people that are my friends, friend request incoming and friend requests outgoing.

7. As a user, I want to be able to share my thoughts and interests by creating content.

8. As a user, I want to be able to view my own posts as well as other users content.

9. As a user, I want to be able to interact with content by liking, reacting, commenting, and sharing.

10. As a user, I want to be able to edit or delete content, comments, shares or likes that I created.

### Authentication

- As a user, I can register for a new account with name, email, and password.

- As a user, I can sign in with my email and password.

- As a user, I can stay sign in with refreshing page.

### Users

- As a user, I can see a list of other users so that I can send accept, or decide friend requests.

- As a user, I can get my current profile info (stay signed in after page refresh).

- As a user, I can see the profile of a specific user given a user ID.

- As a user, I can update my profile info like Avatar, Company, Job Title, Social Links, and short description.

### Posts

- As a user, I can see a list of posts.

- As a user, I can create a new post with text content and an image.

- As a user, I can edit my posts.

- As a user, I can delete my posts.

### Comments

- As a user, I can see a list of comments on a post.

- As a user, I can write comments on a post.

- As a user, I can update my comments.

- As a user, I can delete my comments.

### Reactions

- As a user, I can react like or dislike to a post or comment.

### Friends

- As a user, I can send a friend request to another user who is not my friend.

- As a user, I can see a list of friend requests I have received.

- As a user, I can see a list of friend requests I have sent.

- As a user, I can see a list of my friends.

- As a user, I can accept or decline a friend request.

- As a user, I can cancel a friend request I sent.

- As a user, I can unfriend a user in my friend list.

## Endpoint APIs

### Auth APIs

```javascript
/**
 * @route POST /auth/login
 * @description Log in with email and password
 * @body {email, password}
 * @access Public
 */
```

```javascript
/**
 * @route POST /users
 * @description User Registration
 * @body {name, email, password}
 * @access Public
 */
```

### User APIs

```javascript
/**
 * @route GET /users?page=1&limit=10
 * @description Get user with pagin
 * @access Login required
 */
```

```javascript
/**
 * @route GET /users/me
 * @description Get current user info
 * @access Login required
 */
```

```javascript
/**
 * @route GET /users/:id
 * @description Get a user profile
 * @access Login required
 */
```

```javascript
/**
 * @route PUT /users/:id
 * @description Update user profile
 * @body { name, avatarUrl, coverUrl, aboutMe, city, country, company, jobTitle, facebookLink, instagramLink, linkedinLink, twitterLink }
 * @access Login required
 */
```

### Post APIs

```javascript
/**
 * @route GET /posts/user/:userId?page=1&limit=10
 * @description Get all posts a user can see with pagination
 * @access Login required
 */
```

```javascript
/**
 * @route POST /posts
 * @description Create a new post
 * @body { content, image }
 * @access login required
 */
```

```javascript
/**
 * @route PUT /posts/:id
 * @description Update a post
 * @body { content, image }
 * @access login required
 */
```

```javascript
/**
 * @route DELETE /posts/:id
 * @description Delete a post
 * @access login required
 */
```

### Comment APIs

```javascript
/**
 * @route GET /comments/:id
 * @description Get details of a comment
 * @access Login require
 */
```

```javascript
/**
 * @route POST /comments
 * @description create a new comment
 * @body { content, postId }
 * @access Login required
 * /
```

```javascript
/**
 * @route PUT /commnents/:id
 * @description Update a comment
 * @access Login required
 * /
```

```javascript
/**
 * @route DELETE /commnents/:id
 * @description Delete a comment
 * @access Login required
 * /
```

### Reaction APIs

```javascript
/**
 * @route POST /reactions
 * @description Save a reaction to post or comment
 * @body { targetType: 'Post' or 'Comment', targetId, emoji: 'like' or 'dislike' }
 * @access Login required
 * /
```

### Friend APIs

```javascript
/**
 * @route POST /firends/requests
 * @description Sent a friend request
 * @body {targetUserId: "userId"}
 * @access Login Required
 */
```

```javascript
/**
 * @route GET /friends/requests/incoming
 * @description Get the list of received pending requests
 * @access Login required
 * /
```

```javascript
/**
 * @route GET /friends/requests/outgoing
 * @description Get the list of received pending requests
 * @access Login required
 * /
```

```javascript
/**
 * @route GET /friends
 * @description Get the list of friends
 * @access Login required
 * /
```

```javascript
/**
 * @route PUT /friends/requests/:userId
 * @description Accept/Reject a received pending requests
 * @body { status 'accepted' or 'declined' }
 * @access Login required
 * /
```

```javascript
/**
 * @route DELETE /friends/requests/:userId
 * @description Cancel a friend request
 * @access Login required
 */
```

```javascript
/**
 * @route PUT /friends/:userId
 * @description Remove a friend
 * @access Login required
 */
```
