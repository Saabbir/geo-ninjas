<template>
  <div class="google-map container">
    <div id="map"></div>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import db from '@/firebase/init'

  export default {
    name: 'GoogleMap',
    data() {
      return {
        lat: 53,
        lng: -2
      }
    },
    methods: {
      renderMap() {
        const map = new google.maps.Map(document.getElementById('map'), {
          center: {
            lat: this.lat,
            lng: this.lng
          },
          zoom: 6,
          maxZoom: 15,
          minZoom: 3,
          streetViewControl: false
        })

        db.collection('users').get()
        .then(users => {
          users.docs.forEach(doc => {
            const data = doc.data()
            if (data.geolocation) {
              const marker = new google.maps.Marker({
                position: {
                  lat: data.geolocation.lat,
                  lng: data.geolocation.lng
                },
                map: map
              })
              marker.addListener('click', () => {
                this.$router.push({name: 'ViewProfile', params: {id: doc.id}})
              })
            }
          })
        })
      }
    },
    mounted() {
      // get current user
      const currentUser = firebase.auth().currentUser

      // get user geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          this.lat = pos.coords.latitude
          this.lng = pos.coords.longitude

          // find the user record and then update geocoords
          db.collection('users').where('user_id', '==', currentUser.uid).get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              db.collection('users').doc(doc.id).update({
                geolocation: {
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude
                }
              })
            })
          }).then(() => {
            this.renderMap()
          })
        }, err => {
          this.renderMap()
        }, {
          maximumAge: 60000,
          timeout: 3000
        })
      } else {
        // position center by default values
        this.renderMap()
      }
    },
  }
</script>

<style>
#map {
  position: fixed !important;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
}
</style>