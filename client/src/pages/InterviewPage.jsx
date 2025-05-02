import UploadPage from "./UploadPage";

export default function InterviewPage() {
  return (
    <UploadPage
      title="Interview Preparation"
      subtitle="Upload your resume and let AI simulate a real interview experience."
      backPath="/selection"
      onExtractedText="/interview/bot"
      localStorageKey="resumeText"
    />
  );
}
