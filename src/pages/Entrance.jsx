import React from "react";
import StorybookEntrance from "@/components/entrance/StorybookEntrance";

export default function Entrance() {
  return (
    <StorybookEntrance
      edition="main"
      createLink="/create"
      classicLink="/home"
    />
  );
}