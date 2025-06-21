import { useState } from "react";

type ToastColor = "success" | "danger";

interface UseToastReturn {
  showToast: boolean;
  toastMessage: string;
  toastColor: ToastColor;
  showSuccessToast: (message: string) => void;
  showErrorToast: (message: string) => void;
  hideToast: () => void;
}

export const useToast = (): UseToastReturn => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState<ToastColor>("success");

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setToastColor("success");
    setShowToast(true);
  };

  const showErrorToast = (message: string) => {
    setToastMessage(message);
    setToastColor("danger");
    setShowToast(true);
  };

  const hideToast = () => {
    setShowToast(false);
  };

  return {
    showToast,
    toastMessage,
    toastColor,
    showSuccessToast,
    showErrorToast,
    hideToast,
  };
};
