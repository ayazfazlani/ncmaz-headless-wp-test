import React, { FC, useContext, useEffect } from "react";
import ButtonPrimary from "@/components/Button/ButtonPrimary";
import Textarea from "@/components/Textarea/Textarea";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import { CommentWrapContext } from "./SingleCommentWrap";
import { useLoginModal } from "@/hooks/useLoginModal";
import toast from "react-hot-toast";

import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import getTrans from "@/utils/getTrans";

export interface CommentFormData {
  content: string;
  author?: string;
  authorEmail?: string;
  authorUrl?: string;
}

export interface SingleCommentFormProps {
  className?: string;
  onClickSubmit?: (data: CommentFormData) => void;
  onClickCancel?: () => void;
  defaultValue?: string;
  rows?: number;
  isAutoFocus?: boolean;
  isReplyingComment?: boolean;
  isEditingComment?: boolean;
  isSuccessfulCreatedComment?: boolean;
}

const SingleCommentForm: FC<SingleCommentFormProps> = ({
  className = "mt-5",
  onClickSubmit,
  onClickCancel,
  defaultValue = "",
  rows = 4,
  isAutoFocus,
  isReplyingComment,
  isEditingComment,
  isSuccessfulCreatedComment,
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const nameRef = React.useRef<HTMLInputElement>(null);
  const T = getTrans();
  
  // Note: Only name and message are required for guest comments
  //
  const { openLoginModal } = useLoginModal();
  const { isReady, isAuthenticated } = useSelector(
    (state: RootState) => state.viewer.authorizedUser
  );
  const { viewer } = useSelector((state: RootState) => state.viewer);
  let {
    isCreateNewCommentLoading,
    isCreateNewReplyCommentLoading,
    isUpdateCommentByIdLoading,
  } = useContext(CommentWrapContext);
  //
  useEffect(() => {
    isAutoFocus && textareaRef.current?.focus();
  }, [textareaRef, isAutoFocus]);

  // remove text on textarea when submit success
  useEffect(() => {
    if (
      isReplyingComment ||
      isEditingComment ||
      isCreateNewCommentLoading ||
      isSuccessfulCreatedComment
    ) {
      return;
    }

    textareaRef.current && (textareaRef.current.value = "");
    if (!isAuthenticated) {
      nameRef.current && (nameRef.current.value = "");
    }
  }, [
    isCreateNewCommentLoading,
    textareaRef,
    isEditingComment,
    isReplyingComment,
    isSuccessfulCreatedComment,
    isAuthenticated,
  ]);

  let isLoading = false;
  if (isReplyingComment) {
    isLoading = !!isCreateNewReplyCommentLoading;
  } else if (isEditingComment) {
    isLoading = !!isUpdateCommentByIdLoading;
  } else {
    isLoading = !!isCreateNewCommentLoading;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !isReady) {
      return;
    }

    const content = textareaRef?.current?.value || "";
    if (!content.trim()) {
      return;
    }

    // For authenticated users, use their info
    if (isAuthenticated && viewer) {
      onClickSubmit && onClickSubmit({
        content,
        author: viewer.name || undefined,
        authorEmail: viewer.email || undefined,
      });
      return;
    }

    // For guest users, require only name
    const author = nameRef?.current?.value?.trim() || "";

    if (!author) {
      toast.error("Please enter your name");
      nameRef.current?.focus();
      return;
    }

    onClickSubmit && onClickSubmit({
      content,
      author,
    });
  };

  const showGuestFields = !isAuthenticated && !isEditingComment;

  return (
    <form
      action="#"
      onSubmit={handleSubmit}
      className={`nc-SingleCommentForm ${className}`}
    >
      {showGuestFields && (
        <div className="mb-4">
          <Input
            ref={nameRef}
            type="text"
            placeholder="Your Name *"
            required
            className="w-full"
          />
        </div>
      )}
      <Textarea
        placeholder={T.pageSingle["Add to discussion"]}
        ref={textareaRef}
        required={true}
        defaultValue={defaultValue}
        rows={rows}
      />
      <div className="mt-2.5 flex flex-wrap gap-2">
        <ButtonPrimary
          loading={isLoading}
          type="submit"
        >
          {T.Submit}
        </ButtonPrimary>
        <Button
          type="button"
          disabled={isLoading}
          pattern="link"
          onClick={() => {
            onClickCancel && onClickCancel();
            if (textareaRef.current) {
              textareaRef.current.value = "";
            }
            if (showGuestFields) {
              nameRef.current && (nameRef.current.value = "");
            }
          }}
        >
          {T.Cancel}
        </Button>
      </div>
    </form>
  );
};

export default SingleCommentForm;
