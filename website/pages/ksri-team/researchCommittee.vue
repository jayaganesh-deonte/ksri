<template>
  <div style="" class="d-flex flex-column align-center">
    <div class="text-center my-4">
      <div class="text-h6">
        A Committee is constituted to help the Institute in identifying the
        texts to be published and also in other matters related to the research
        work of the Institute. At present the following scholars are the
        members.
      </div>
    </div>
    <div>
      <div v-for="key in publicationCommitteeKeys" class="ma-6" :key="key">
        <div
          class="sectionTitle3 my-2 text-center"
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
      </div>
    </div>
  </div>
</template>

<script setup>
const description =
  "A Committee is constituted to help the Institute in identifying the texts to be published and also in other matters related to the research work of the Institute. At present the following scholars are the members.";
useSeoMeta({
  title: "Research Committee",
  description: description,
  ogTitle: "Research Committee",
  ogDescription: description,
  twitterTitle: "Research Committee",
  twitterDescription: description,
});

const publicationCommittee = await queryContent(
  "publications",
  "committeemembers"
).findOne();

const publicationCommitteeKeys = ["Research Committee"];

let committee = {};
let researchCommitee = [];
let editorialCommittee = [];

console.log("publicationCommittee", publicationCommittee);

publicationCommittee.body.sort((a, b) => a.orderId - b.orderId);

publicationCommittee.body.forEach((member) => {
  if (publicationCommitteeKeys.includes(member.designation)) {
    committee[member.designation] = member;
  }
  if (member.designation === "Research Committee") {
    researchCommitee.push(member);
  }
  if (member.designation === "Editorial Committee") {
    editorialCommittee.push(member);
  }
});

committee = {
  "Research Committee": researchCommitee,
  "Editorial Committee": editorialCommittee,
};
</script>
