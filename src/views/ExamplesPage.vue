<template>
  <div>
    <h1>Примеры с практик 27–28</h1>
    <ReactiveDemo />
    <ConditionalListDemo />
    <EventComputedDemo />
    <UserCards />
    <SearchExample />
  </div>
</template>

<script>
import ReactiveDemo from '../components/ReactiveDemo.vue'
import ConditionalListDemo from '../components/ConditionalListDemo.vue'
import EventComputedDemo from '../components/EventComputedDemo.vue'
import UserCards from '../components/UserCards.vue'
import SearchExample from '../components/SearchExample.vue'
export default { components: { ReactiveDemo, ConditionalListDemo, EventComputedDemo, UserCards, SearchExample } }
</script>
