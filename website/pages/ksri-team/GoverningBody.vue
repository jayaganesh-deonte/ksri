<template>
  <v-card width="90vw" class="mx-2" elevation="0">
    <div v-for="key in governingBodyMemberKeys" class="my-4" :key="key">
      <div
        class="sectionTitle3 my-2"
        data-aos="zoom-in"
        data-aos-duration="1000"
        data-aos-delay="400"
      >
        {{ key }}
      </div>
      <v-row class="memberRow" no-gutters>
        <v-col
          v-for="member in governingBodyMembers[key]"
          :key="member"
          no-gutters
          cols="12"
          sm="12"
          :md="governingBodyMembers[key].length === 1 ? 12 : 6"
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
      <div class="bottomBg"></div>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    governingBodyMemberKeys: {
      type: Array,
      required: true,
    },
    governingBodyMembers: {
      type: Object,
      required: true,
    },
  },
};
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
