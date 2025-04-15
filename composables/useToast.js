import { toast } from "sonner";

export const useToast = () => {
  const showToast = ({ title, description, variant = "default" }) => {
    if (variant === "destructive") {
      toast.error(title, {
        description,
      });
    } else if (variant === "success") {
      toast.success(title, {
        description,
      });
    } else {
      toast(title, {
        description,
      });
    }
  };

  return {
    toast: showToast,
  };
};
