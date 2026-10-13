function fileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string"
      ? resolve(reader.result)
      : reject(new Error("Unable to read audio answer."));
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read audio answer."));
    reader.readAsDataURL(file);
  });
}

export async function saveAudioAnswer(questionId: number, file: File): Promise<void> {
  localStorage.setItem(`question-${questionId}-recording`, await fileAsDataUrl(file));
}

export async function loadAudioAnswer(questionId: number): Promise<File | undefined> {
  const dataUrl = localStorage.getItem(`question-${questionId}-recording`);
  if (!dataUrl) return;

  const blob = await (await fetch(dataUrl)).blob();
  return new File([blob], `question-${questionId}.webm`, {
    type: blob.type || "audio/webm",
  });
}
