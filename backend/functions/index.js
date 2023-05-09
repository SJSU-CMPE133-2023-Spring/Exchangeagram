/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {getFirestore, doc, updateDoc, increment} = require("firebase-admin/firestore");

admin.initializeApp();

const db = getFirestore();
exports.addLike = functions.firestore.document("posts/{creatorId}/userPosts/{postId}/likes/{userId}")
    .onCreate(async (snap, context) => {
      const {creatorId, postId} = context.params;
      const postRef = doc(db, "posts", creatorId, "userPosts", postId);
      await updateDoc(postRef, {likesCount: increment(1)});
    });

exports.removeLike = functions.firestore.document("posts/{creatorId}/userPosts/{postId}/likes/{userId}")
    .onDelete(async (snap, context) => {
      const {creatorId, postId} = context.params;
      const postRef = doc(db, "posts", creatorId, "userPosts", postId);
      await updateDoc(postRef, {likesCount: increment(-1)});
    });
