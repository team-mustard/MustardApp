<template>
  <div id='team-mustard-app'>
    <b-navbar toggleable='lg' type='light' variant='light'>
      <b-navbar-brand href='#'><strong>Team Mustard</strong>
      </b-navbar-brand>

      <b-navbar-nav class='ml-auto'>
        <b-button v-b-tooltip.hover title='This will pick Team Mustard day' size='lg' v-on:click='pickTeamMustardDay'>
          Pick The Day
        </b-button>
      </b-navbar-nav>
    </b-navbar>
    <br />

    <b-container>
      <b-row>
        <b-col sm='12' md='6'>
          <SpinWheel v-if='dayOptions' :segments='dayOptions' class='dayWheel' />
        </b-col>
        <b-col sm='12' md='6'>
          <div v-if='selectedDay'>
            <b-card :title='selectedDay.label' :img-src='selectedDay.img' style='max-width: 30rem; margin: auto;'>
              <b-card-text>{{selectedDay.info}}</b-card-text>
            </b-card>
          </div>
          <div v-else style='text-align: center; color: rgb(172, 172, 172)'>
            <p>You haven't picked a day yet...</p>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'team-mustard-app',
  components: {
    'SpinWheel': () => import ('./components/SpinWheel.vue')
  },
  data: function () {
    return {
      dayOptions: null,
      selectedDay: null
    }
  },
  created: async function () {
    await this.fetchData()
  },
  methods: {
    fetchData: async function () {
      const response = await fetch('/api/days')
      const jsonData = await response.json()
      this.dayOptions = jsonData
    },
    pickTeamMustardDay: async function () {
      const response = await fetch('/api/days/actions/pick', { method: 'POST' })
      const jsonData = await response.json()
      this.selectedDay = jsonData
    }
  }
}
</script>

<style>
.dayWheel {
  width: 100%;
}
</style>
