"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function useParty() {
  const [members, setMembers] = useState<string[]>([]);

  const handleJoinClick = (partyId: string) => {
    socket.emit("joinParty", partyId);
  };

  const handleLeaveClick = (partyId: string) => {
    socket.emit("leaveParty", partyId);
  };

  useEffect(() => {
    socket.on("newMemberJoined", (userId: string) => {
      setMembers([...members, userId]);
    });

    socket.on("memberLeave", (userId: string) => {
      console.log("  user id", userId);

      setMembers(members.filter((member) => member != userId));
    });

    return () => {
      socket.off("joinParty");
    };
  }, [members]);

  return { members, handleJoinClick, handleLeaveClick };
}
