<template>
  <div>
    <v-row class="memberRow" no-gutters>
      <v-col
        v-for="(member, index) in displayedMembers"
        :key="index"
        no-gutters
        cols="12"
        sm="12"
        :md="
          governingBodyMembers[governingBodyMembersKey].length === 1 ? 12 : 6
        "
        class="memberCol"
      >
        <v-card
          fluid
          variant="flat"
          class="ma-2 pa-4 text-center text-h6"
          min-height="80"
          rounded="0"
          elevation="0"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="400"
        >
          <div
            :class="member.startYear ? '' : 'memberName'"
            class="text-h6 font-weight-bold"
          >
            {{ member.name }}
          </div>
          <div class="text-body-1">{{ member.subtitle }}</div>
          <div
            class="text-body-1"
            v-if="member.endYear"
            :class="member.startYear ? 'memberName' : ''"
          >
            {{ member.startYear }} - {{ member.endYear }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add a centered last item if odd count -->
    <v-row v-if="isOddCount" class="memberRow" no-gutters justify="center">
      <v-col cols="12" sm="12" md="6" class="memberCol">
        <v-card
          fluid
          variant="flat"
          class="ma-2 pa-4 text-center text-h6"
          min-height="80"
          rounded="0"
          elevation="0"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="400"
        >
          <div
            :class="lastMember.startYear ? '' : 'memberName'"
            class="text-h6 font-weight-bold"
          >
            {{ lastMember.name }}
          </div>
          <div class="text-body-1">{{ lastMember.subtitle }}</div>
          <div
            class="text-body-1"
            v-if="lastMember.endYear"
            :class="lastMember.startYear ? 'memberName' : ''"
          >
            {{ lastMember.startYear }} - {{ lastMember.endYear }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <div class="bottomBg"></div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  governingBodyMembers: { type: Object, required: true },
  governingBodyMembersKey: { type: String, required: true },
});

const isOddCount = computed(() => {
  return (
    props.governingBodyMembers[props.governingBodyMembersKey].length % 2 !== 0
  );
});

const displayedMembers = computed(() => {
  const allMembers = props.governingBodyMembers[props.governingBodyMembersKey];
  // If odd count, return all except the last one
  // If even count, return all members
  return isOddCount.value ? allMembers.slice(0, -1) : allMembers;
});

const lastMember = computed(() => {
  const allMembers = props.governingBodyMembers[props.governingBodyMembersKey];
  return isOddCount.value ? allMembers[allMembers.length - 1] : null;
});
</script>

<style scoped>
/*for memberName put underline with green color*/
.memberName {
  text-decoration: underline;
  text-decoration-color: #4caf50;
  text-decoration-thickness: 1.5px;
  text-underline-offset: 10px;
  margin: 10px 0px;
}

/*for memberCol add border*/
.memberCol {
  border: 1px solid #f0f5f0;
}

.bottomBg {
  height: 5px;
  width: 90%;
  background-color: #f0f5f0;
  margin-left: auto;
  margin-right: auto;
}
</style>
