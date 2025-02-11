<template>
  <div>
    <div class="text-center my-4">
      <div class="text-h6">
        The editorial committee performs a thorough scrutiny in the edition of
        The Journal of Oriental Research and other publications being brought
        out by the KSRI.
      </div>
    </div>
    <div>
      <div v-for="key in publicationCommitteeKeys" class="ma-6" :key="key">
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
      </div>
    </div>
  </div>
</template>

<script setup>
const description =
  "A Committee is constituted to help the Institute in identifying the texts to be published and also in other matters related to the research work of the Institute. At present the following scholars are the members.";
useSeoMeta({
  title: "Editorial Committee",
  description: description,
  ogTitle: "Editorial Committee",
  ogDescription: description,
  twitterTitle: "Editorial Committee",
  twitterDescription: description,
});

const publicationCommittee = await queryContent(
  "publications",
  "committeemembers"
).findOne();

const publicationCommitteeKeys = ["Editorial Committee"];

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
