import React from "react";
import StorybookEntrance from "@/components/entrance/StorybookEntrance";

export default function CompanionEntrance() {
  return (
    <StorybookEntrance
      edition="companion"
      createLink="/companion/create"
      classicLink="/companion/classic"
      mainSiteLink="/"
    />
  );
}