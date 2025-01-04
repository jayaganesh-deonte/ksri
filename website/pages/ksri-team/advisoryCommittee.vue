<template>
  <div>
    <!-- <div class="text-center my-4">
      <div class="text-h6">Advisory</div>
    </div> -->
    <div>
      <!-- <div v-for="key in publicationCommitteeKeys" class="ma-6" :key="key">
        <div
          class="sectionTitle3 my-2"
          data-aos="zoom-in"
          data-aos-duration="1000"
          data-aos-delay="400"
        >
          {{ key }}
        </div>
        <CommitteeMembers
          :governingBodyMembers="committee"
          :governingBodyMembersKey="key"
        />
      </div> -->

      <div
        class="sectionTitle3 my-2"
        data-aos="zoom-in"
        data-aos-duration="1000"
        data-aos-delay="400"
      >
        Advisory Board
      </div>

      <CommitteeMembers
        :governingBodyMembers="members"
        :governingBodyMembersKey="advisoryboardKeys"
      />
    </div>
  </div>
</template>

<script setup>
const description =
  "A Committee is constituted to help the Institute in identifying the texts to be published and also in other matters related to the research work of the Institute. At present the following scholars are the members.";
useSeoMeta({
  title: "Advisory Committee",
  description: description,
  ogTitle: "Advisory Committee",
  ogDescription: description,
  twitterTitle: "Advisory Committee",
  twitterDescription: description,
});

const advisoryboard = await queryContent("advisoryboard").findOne();

const committee = advisoryboard.body;

console.log(committee);

// rename subTitle as subtitle for all objects in committee
committee.forEach((member) => {
  member.subtitle = member.subTitle;
  delete member.subTitle;
});

const advisoryboardKeys = ["Advisory Board"];

console.log("advisoryboardKeys", advisoryboardKeys);

const members = {
  "Advisory Board": committee,
};
</script>
