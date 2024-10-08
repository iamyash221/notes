import React, { useState } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const AddEditNotes = ({
  noteData,
  type,
  onclose,
  getAllNotes,
  showToastMsg,
}) => {
  const [title, settitle] = useState(noteData?.title || "");
  const [content, setcontent] = useState(noteData?.content || "");
  const [tags, settags] = useState(noteData?.tags || []);

  const [error, seterror] = useState(null);

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      });

      if (response.data && response.data.note) {
        showToastMsg("Note Added Successfully");
        getAllNotes();
        onclose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        seterror(error.response.data.message);
      }
    }
  };
  const editNote = async () => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put("/edit-note/" + noteId, {
        title,
        content,
        tags,
      });

      if (response.data && response.data.note) {
        showToastMsg("Note Updated Successfully");

        getAllNotes();
        onclose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        seterror(error.response.data.message);
      }
    }
  };

  const handleAddNote = () => {
    if (!title) {
      seterror("Please enter the title");
      return;
    }
    if (!content) {
      seterror("Please enter the content");
      return;
    }
    seterror("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onclose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>
      <div className="flex flex-col gap-2">
        <label className="input-label" htmlFor="">
          TITLE
        </label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Go to gym at 5"
          value={title}
          onChange={({ target }) => settitle(target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 mt4">
        <label className="input-label" htmlFor="">
          CONTENT
        </label>
        <textarea
          type="text"
          className="text-sm  text-slate-950 bg-slate-50 outline-none rounded p-2"
          placeholder="Content"
          value={content}
          onChange={({ target }) => setcontent(target.value)}
          rows={10}
        ></textarea>
      </div>

      <div className="mt-3">
        <label htmlFor="" className="input-label">
          TAGS
          <TagInput tags={tags} settags={settags} />
        </label>
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddNote}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
