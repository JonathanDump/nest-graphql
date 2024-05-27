import useParty from "@/app/hooks/useParty";
import React, { useState } from "react";

interface IProps {
  id: string;
}

export default function Party({ id }: IProps) {
  const { handleJoinClick, handleLeaveClick, members } = useParty();
  return (
    <div>
      <h2>{id}</h2>
      <p>Members</p>
      <div className="members">
        {members.map((user) => (
          <div key={user}>{user}</div>
        ))}
      </div>
      <button onClick={() => handleJoinClick(id)}>Join</button>
      <button onClick={() => handleLeaveClick(id)}>Leave</button>
    </div>
  );
}
