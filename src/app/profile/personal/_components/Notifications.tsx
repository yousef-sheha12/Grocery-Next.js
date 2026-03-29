"use client";

// UI Components
import { Switch } from "@/components/ui/switch";

// React Query
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from "@/hooks/useNotificationSettings";

export default function Notifications() {
  const { data: settings, isLoading } = useNotificationSettings();
  const mutation = useUpdateNotificationSettings();

  // Update Notifications Settings API
  const updateNotificationAPI = async (
    category: string,
    key: string,
    value: boolean,
  ) => {
    try {
      // API wait the data as key value
      const payload = { [key]: value ? 1 : 0 };
      await mutation.mutateAsync(payload);
    } catch (error) {
      console.error("Failed to update notifications", error);
    }
  };

  const getSetting = (category: string, key: string) => {
    return settings?.[category]?.settings?.[key];
  };

  return (
    <div className="Notification flex flex-col gap-8 rounded-xl border-[0.8px] border-[#DAD8D8] p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="head flex flex-col justify-between gap-4">
        <h2 className="font-medium text-[20px]">Notification preference</h2>
        <p className="font-normal text-[18px]">
          Manage notification based on your preference
        </p>
      </div>

      {/* Order & Delivery Updates */}
      <div className="Order-Notification flex flex-col gap-4">
        <h2 className="font-medium text-[20px]">Order & Delivery Updates</h2>
        <div className="switchs bg-[#F7FCFF] rounded-2xl p-3">
          <SwitchNotification
            title="Order Confirmation"
            checked={getSetting("order_delivery_updates", "order_confirmation")}
            onCheckedChange={(val) =>
              updateNotificationAPI(
                "order_delivery_updates",
                "order_confirmation",
                val,
              )
            }
          />
          <hr className="bg-[#0000001F]" />
          <SwitchNotification
            title="Order Shipped"
            checked={getSetting("order_delivery_updates", "order_shipped")}
            onCheckedChange={(val) =>
              updateNotificationAPI(
                "order_delivery_updates",
                "order_shipped",
                val,
              )
            }
          />
          <hr className="bg-[#0000001F]" />
          <SwitchNotification
            title="Delivery Updates"
            checked={getSetting("order_delivery_updates", "delivery_updates")}
            onCheckedChange={(val) =>
              updateNotificationAPI(
                "order_delivery_updates",
                "delivery_updates",
                val,
              )
            }
          />
          <hr className="bg-[#0000001F]" />
          <SwitchNotification
            title="Out-of-Stock Alerts"
            checked={getSetting(
              "order_delivery_updates",
              "out_of_stock_alerts",
            )}
            onCheckedChange={(val) =>
              updateNotificationAPI(
                "order_delivery_updates",
                "out_of_stock_alerts",
                val,
              )
            }
          />
        </div>
      </div>

      {/* Account & Reminders */}
      <div className="Account-Reminders flex flex-col gap-4">
        <h2 className="font-medium text-[20px]">Account & Reminders</h2>
        <div className="switchs bg-[#F7FCFF] rounded-2xl p-3">
          <SwitchNotification
            title="Cart Reminders"
            checked={getSetting("account_reminders", "cart_reminders")}
            onCheckedChange={(val) =>
              updateNotificationAPI("account_reminders", "cart_reminders", val)
            }
          />
          <hr className="bg-[#0000001F]" />
          <SwitchNotification
            title="Payment & Billing Notifications"
            checked={getSetting("account_reminders", "payment_billing")}
            onCheckedChange={(val) =>
              updateNotificationAPI("account_reminders", "payment_billing", val)
            }
          />
          <hr className="bg-[#0000001F]" />
          <SwitchNotification
            title="Account Security Alerts"
            checked={getSetting("account_reminders", "account_security")}
            onCheckedChange={(val) =>
              updateNotificationAPI(
                "account_reminders",
                "account_security",
                val,
              )
            }
          />
        </div>
      </div>

      {/* Communication Channels */}
      <div className="Account-Reminders flex flex-col gap-4">
        <h2 className="font-medium text-[20px]">Communication Channels</h2>
        <div className="switchs bg-[#F7FCFF] rounded-2xl p-3">
          <SwitchNotification
            title="Email Notifications"
            checked={getSetting("channels", "email_notifications")}
            onCheckedChange={(val) =>
              updateNotificationAPI("channels", "email_notifications", val)
            }
          />
          <hr className="bg-[#0000001F]" />
          <SwitchNotification
            title="SMS Notifications"
            checked={getSetting("channels", "sms_notifications")}
            onCheckedChange={(val) =>
              updateNotificationAPI("channels", "sms_notifications", val)
            }
          />
          <hr className="bg-[#0000001F]" />
          <SwitchNotification
            title="Push Notifications"
            checked={getSetting("channels", "push_notifications")}
            onCheckedChange={(val) =>
              updateNotificationAPI("channels", "push_notifications", val)
            }
          />
        </div>
      </div>
    </div>
  );
}

const SwitchNotification = ({
  title,
  checked,
  onCheckedChange,
}: {
  title: string;
  checked?: boolean;
  onCheckedChange: (value: boolean) => void;
}) => {
  return (
    <div className="confirmation flex items-center justify-between py-5 h-15">
      <p className="text-[#0E1112] text-[18px]">{title}</p>
      <Switch
        onCheckedChange={onCheckedChange}
        checked={!!checked}
        className="data-[state=checked]:bg-[#014162] data-[state=unchecked]:bg-[#dad8d8] transition-colors"
      />
    </div>
  );
};
