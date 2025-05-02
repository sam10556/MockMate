import UploadPage from "./UploadPage";

export default function ExamPage() {
  return (
    <UploadPage
      title="Exam Preparation"
      subtitle="Upload your study materials and let AI simulate an exam prep experience."
      backPath="/"
      onExtractedText="/exam/bot"
      localStorageKey="examText"
    />
  );
}
