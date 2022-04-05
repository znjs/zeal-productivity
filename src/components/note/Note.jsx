import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import tw from "tailwind-styled-components";

import "./note.css";

function Note() {
  const [showList, setShowList] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState(
    JSON.parse(localStorage.getItem("notes")) || []
  );
  const [showNote, setShowNote] = useState(!!notes.length);

  const removeNote = (id) => {
    setNotes((prev) => {
      let updatedNotes = prev.filter((item) => item._id !== id);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      return updatedNotes;
    });
    setNotes((prev) => {
      if (!prev.length) setShowNote(false);
      return prev;
    });
  };

  return (
    <SUPERWRAPPER>
      {showList ? (
        <CONTAINER>
          {showNote ? (
            <>
              <NOTES>
                {notes.map((note) => {
                  return (
                    <NOTEITEM key={note._id}>
                      <CHECKBOX
                        type="checkbox"
                        id={note._id}
                        name="scales"
                        checked={note.isDone}
                        onChange={() => {
                          setNotes((prev) => {
                            let updatedNotes = prev.map((item) =>
                              item._id === note._id
                                ? { ...item, isDone: !item.isDone }
                                : item
                            );
                            localStorage.setItem(
                              "notes",
                              JSON.stringify(updatedNotes)
                            );
                            return updatedNotes;
                          });
                        }}
                      />
                      <LABEL
                        style={{
                          textDecoration: note.isDone ? "line-through" : "none",
                          opacity: note.isDone ? 0.6 : 1,
                        }}
                        htmlFor={note._id}
                      >
                        {note.note}
                      </LABEL>
                      <NOTECLOSE
                        onClick={() => {
                          removeNote(note._id);
                        }}
                      />
                    </NOTEITEM>
                  );
                })}
              </NOTES>
              <TEXTINPUT
                autoFocus={true}
                type="text"
                placeholder="Add your note"
                value={noteText}
                onChange={(e) => {
                  setNoteText(e.target.value);
                }}
                onKeyUp={(e) => {
                  if (e.key === "Enter" && noteText.length) {
                    setNotes((prev) => [
                      ...prev,
                      { _id: nanoid(), note: noteText, isDone: false },
                    ]);
                    setNotes((prev) => {
                      localStorage.setItem("notes", JSON.stringify(prev));
                      return prev;
                    });
                    setNoteText("");
                  }
                }}
              />
            </>
          ) : (
            <NOTEBUTTON onClick={() => setShowNote(true)}>Add note</NOTEBUTTON>
          )}
        </CONTAINER>
      ) : null}
      <NOTE
        onClick={() => {
          notes.length === 0 && setShowNote(false);
          setShowList((prev) => !prev);
        }}
      >
        Todo
      </NOTE>
    </SUPERWRAPPER>
  );
}

const SUPERWRAPPER = tw.div`absolute z-20 bottom-0 right-0 pb-6 pr-4 `;
const CONTAINER = tw.div`backdrop-blur-m p-2 rounded bg-[#0f0f0fa3] w-64 min-h-xl flex flex-col items-center justify-center`;
const TEXTINPUT = tw.input`p-2 bg-transparent outline-none placeholder:text-gray-500 w-full mt-4`;
const NOTE = tw.h2`select-none cursor-pointer inline-block flex justify-end`;
const NOTES = tw.div`max-h-xl w-full overflow-auto grow`;
const NOTEITEM = tw.div`flex w-full items-center m-y-2 p-1 gap-x-2 hover:bg-[#80808029]`;
const CHECKBOX = tw.input`note-check bg-transparent`;
const LABEL = tw.label`select-none block grow note-label`;
const NOTEBUTTON = tw.button`bg-gray-800 p-2 rounded-xl inline-block self-center `;
const NOTECLOSE = tw.i`fa-solid fa-times cursor-pointer`;

export { Note };
