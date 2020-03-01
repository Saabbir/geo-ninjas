<template>
  <div class="view-profile container">
    <div v-if="profile" class="card">
      <h2 class="center deep-purple-text">{{ profile.alias }}'s Wall</h2>
      <ul class="comments collection">
        <li v-for="(comment, index) in comments" :key="index">
          <div class="deep-purple-text">{{ comment.from }}</div>
          <div class="grey-text text-darken-2">{{ comment.content }}</div>
        </li>
      </ul>
      <form @submit.prevent="addComment">
        <div class="field">
          <label for="comment">Add a Comment</label>
          <input type="text" name="comment" v-model="newComment">
          <p class="red-text" v-if="feedback">{{ feedback }}}</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import db from '@/firebase/init'
  import firebase from 'firebase'

  export default {
    name: 'ViewProfile',
    data() {
      return {
        profile: null,
        feedback: null,
        newComment: null,
        user: null,
        comments: []
      }
    },
    methods: {
      addComment() {
        if (this.newComment) {
          this.feedback = null
          db.collection('comments').add({
            to: this.$route.params.id,
            from: this.user.alias,
            content: this.newComment,
            timestamp: Date.now()
          }).then(() => {
            this.newComment = null
          })
        } else {
          this.feedback = 'You must enter a comment to add'
        }
      }
    },
    created() {
      // get profile data
      db.collection('users').doc(this.$route.params.id).get()
      .then(user => {
        this.profile = user.data()
      })

      // get current logged in user
      db.collection('users').where('user_id', '==', firebase.auth().currentUser.uid).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.user = doc.data()
          this.user.id = doc.id
        })
      })

      // get profile wall comments
      db.collection('comments').where('to', '==', this.$route.params.id)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            this.comments.unshift({
              from: change.doc.data().from,
              content: change.doc.data().content
            })
          }
        })
      })
    },
  }
</script>

<style>
  .view-profile .card {
    padding: 20px;
    margin-top: 60px;
  }

  .view-profile h2 {
    font-size: 2em;
    margin-top: 0;
  }

  .view-profile li {
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
</style>