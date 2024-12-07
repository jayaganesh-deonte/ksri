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
      <CommitteeMembers
        :governingBodyMembers="governingBodyMembers"
        :governingBodyMembersKey="key"
      />
    </div>
  </v-card>
</template>

<script setup>
useSeoMeta({
  title: "Governing Body",
  description: "Governing Body",
  ogTitle: "Governing Body",
  ogDescription: "Governing Body",
  twitterTitle: "Governing Body",
  twitterDescription: "Governing Body",
});
</script>

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
