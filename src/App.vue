<template>
  <div id='lunchify-app'>
    <b-navbar toggleable='lg' type='light' variant='light'>
      <b-navbar-brand href='#'><strong>Lunchify</strong> - <i>The app that picks your meals for you!</i>
      </b-navbar-brand>

      <b-navbar-nav class='ml-auto'>
        <b-button v-b-tooltip.hover title='This will pick a random lunch for you' size='lg' v-on:click='pickMyLunch'>
          Pick My Lunch
        </b-button>
      </b-navbar-nav>
    </b-navbar>
    <br />

    <b-container>
      <b-row>
        <b-col>
          <SpinWheel :segments='lunchOptions' class='lunchWheel' />
        </b-col>
        <b-col>
          <div v-if='selectedLunch'>
            <b-card :title='selectedLunch.label' :img-src='selectedLunch.img' style='max-width: 30rem; margin: auto;'>
              <b-card-text>{{selectedLunch.info}}</b-card-text>
            </b-card>
          </div>
          <div v-else style='text-align: center; color: rgb(172, 172, 172)'>
            <p>You haven't picked a lunch yet...</p>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
const lunchOptions = [
  {
    label: "Fries",
    colour: "#fff200",
    info: "Great choice! Fries rule!",
    img: "https://cms.splendidtable.org/sites/default/files/styles/w2000/public/french-fries.jpg?itok=FS-YwUYH"
  },
  {
    label: "Sushi",
    colour: "#f6989d",
    info: "A veggie role for me please!",
    img: "https://www.parcelpal.com/wp-content/uploads/2017/06/MomoSushi.jpg"
  },
  {
    label: "Salad",
    colour: "#3cb878",
    info: "A very healthy choice.",
    img: "https://www.ndtv.com/cooks/images/tossed-mixed-salad-620.jpg"
  },
  {
    label: "Pizza",
    colour: "#ee1c24",
    info: "Delecious, yummy, tasty pizza...",
    img: "https://recipes.timesofindia.com/photo/53110049.cms"
  }
]

export default {
  name: 'lunchify-app',
  components: {
    'SpinWheel': () => import ('./components/SpinWheel.vue')
  },
  data: function () {
    return {
      lunchOptions: lunchOptions,
      selectedLunch: null
    }
  },
  methods: {
    pickMyLunch: function () {
      this.selectedLunch = lunchOptions[Math.floor(Math.random() * lunchOptions.length)]
    }
  }
}
</script>

<style>
.lunchWheel {
  width: 30rem;
  height: 30rem;
}
</style>
