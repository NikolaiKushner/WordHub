import { useSignal } from "@preact/signals";
import {
  Button,
  Checkbox,
  Input,
  Select,
  Textarea,
} from "../components/ui/index.ts";

export default function AdminSettingsForm() {
  // General Settings
  const siteName = useSignal("Fresh Project");
  const siteDescription = useSignal("A modern web application");
  const maintenanceMode = useSignal(false);
  const allowRegistrations = useSignal(true);
  const requireEmailVerification = useSignal(false);

  // Security Settings
  const minPasswordLength = useSignal("6");
  const requireStrongPassword = useSignal(false);
  const sessionTimeout = useSignal("7");
  const maxLoginAttempts = useSignal("5");
  const lockoutDuration = useSignal("15");

  // Email Settings
  const smtpEnabled = useSignal(false);
  const smtpHost = useSignal("");
  const smtpPort = useSignal("587");
  const smtpUser = useSignal("");
  const smtpPassword = useSignal("");

  // Notification Settings
  const adminEmail = useSignal("");
  const notifyOnNewUser = useSignal(true);
  const notifyOnError = useSignal(true);

  // General state
  const error = useSignal("");
  const success = useSignal("");
  const loading = useSignal(false);

  const handleSave = async (section: string) => {
    loading.value = true;
    error.value = "";
    success.value = "";

    try {
      // In a real app, you'd save these to a system_settings table
      // For now, we'll just show a success message
      await new Promise((resolve) => setTimeout(resolve, 500));
      success.value = `${section} settings saved successfully!`;
      setTimeout(() => {
        success.value = "";
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = "An unknown error occurred";
      }
    } finally {
      loading.value = false;
    }
  };

  return (
    <div class="space-y-6">
      {error.value && (
        <div
          class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
          role="alert"
        >
          {error.value}
        </div>
      )}

      {success.value && (
        <div
          class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm"
          role="alert"
        >
          {success.value}
        </div>
      )}

      {/* General Settings */}
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          General Settings
        </h2>

        <div class="space-y-4">
          <Input
            label="Site Name"
            type="text"
            id="siteName"
            value={siteName.value}
            onInput={(
              e,
            ) => (siteName.value = (e.target as HTMLInputElement).value)}
            placeholder="Your Site Name"
            fullWidth
            variant="filled"
            size="md"
          />

          <Textarea
            label="Site Description"
            id="siteDescription"
            value={siteDescription.value}
            onInput={(
              e,
            ) => (siteDescription.value =
              (e.target as HTMLTextAreaElement).value)}
            placeholder="A brief description of your site"
            fullWidth
            rows={3}
          />

          <Checkbox
            id="maintenanceMode"
            checked={maintenanceMode.value}
            onChange={(
              e,
            ) => (maintenanceMode.value =
              (e.target as HTMLInputElement).checked)}
            label="Maintenance Mode"
            helperText="Enable maintenance mode to restrict access to admins only"
          />

          <Checkbox
            id="allowRegistrations"
            checked={allowRegistrations.value}
            onChange={(
              e,
            ) => (allowRegistrations.value = (e.target as HTMLInputElement)
              .checked)}
            label="Allow New Registrations"
            helperText="Allow new users to create accounts"
          />

          <Checkbox
            id="requireEmailVerification"
            checked={requireEmailVerification.value}
            onChange={(
              e,
            ) => (requireEmailVerification.value =
              (e.target as HTMLInputElement)
                .checked)}
            label="Require Email Verification"
            helperText="Require users to verify their email before accessing the site"
          />
        </div>

        <div class="mt-6">
          <Button
            type="button"
            variant="primary"
            size="md"
            loading={loading.value}
            onClick={() => handleSave("General")}
          >
            Save General Settings
          </Button>
        </div>
      </div>

      {/* Security Settings */}
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Security Settings
        </h2>

        <div class="space-y-4">
          <Input
            label="Minimum Password Length"
            type="number"
            id="minPasswordLength"
            value={minPasswordLength.value}
            onInput={(
              e,
            ) => (minPasswordLength.value =
              (e.target as HTMLInputElement).value)}
            placeholder="6"
            min="6"
            max="32"
            fullWidth
            variant="filled"
            size="md"
          />

          <Checkbox
            id="requireStrongPassword"
            checked={requireStrongPassword.value}
            onChange={(
              e,
            ) => (requireStrongPassword.value = (e.target as HTMLInputElement)
              .checked)}
            label="Require Strong Passwords"
            helperText="Require passwords to contain uppercase, lowercase, numbers, and special characters"
          />

          <Input
            label="Session Timeout (days)"
            type="number"
            id="sessionTimeout"
            value={sessionTimeout.value}
            onInput={(
              e,
            ) => (sessionTimeout.value = (e.target as HTMLInputElement).value)}
            placeholder="7"
            min="1"
            max="365"
            fullWidth
            variant="filled"
            size="md"
          />

          <Input
            label="Max Login Attempts"
            type="number"
            id="maxLoginAttempts"
            value={maxLoginAttempts.value}
            onInput={(
              e,
            ) => (maxLoginAttempts.value =
              (e.target as HTMLInputElement).value)}
            placeholder="5"
            min="3"
            max="10"
            fullWidth
            variant="filled"
            size="md"
          />

          <Input
            label="Lockout Duration (minutes)"
            type="number"
            id="lockoutDuration"
            value={lockoutDuration.value}
            onInput={(
              e,
            ) => (lockoutDuration.value = (e.target as HTMLInputElement).value)}
            placeholder="15"
            min="5"
            max="60"
            fullWidth
            variant="filled"
            size="md"
          />
        </div>

        <div class="mt-6">
          <Button
            type="button"
            variant="primary"
            size="md"
            loading={loading.value}
            onClick={() => handleSave("Security")}
          >
            Save Security Settings
          </Button>
        </div>
      </div>

      {/* Email Settings */}
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Email Settings
        </h2>

        <div class="space-y-4">
          <Checkbox
            id="smtpEnabled"
            checked={smtpEnabled.value}
            onChange={(
              e,
            ) => (smtpEnabled.value = (e.target as HTMLInputElement).checked)}
            label="Enable Custom SMTP"
            helperText="Use custom SMTP server instead of Supabase email service"
          />

          {smtpEnabled.value && (
            <>
              <Input
                label="SMTP Host"
                type="text"
                id="smtpHost"
                value={smtpHost.value}
                onInput={(
                  e,
                ) => (smtpHost.value = (e.target as HTMLInputElement).value)}
                placeholder="smtp.example.com"
                fullWidth
                variant="filled"
                size="md"
              />

              <Input
                label="SMTP Port"
                type="number"
                id="smtpPort"
                value={smtpPort.value}
                onInput={(
                  e,
                ) => (smtpPort.value = (e.target as HTMLInputElement).value)}
                placeholder="587"
                min="1"
                max="65535"
                fullWidth
                variant="filled"
                size="md"
              />

              <Input
                label="SMTP Username"
                type="text"
                id="smtpUser"
                value={smtpUser.value}
                onInput={(
                  e,
                ) => (smtpUser.value = (e.target as HTMLInputElement).value)}
                placeholder="username"
                fullWidth
                variant="filled"
                size="md"
              />

              <Input
                label="SMTP Password"
                type="password"
                id="smtpPassword"
                value={smtpPassword.value}
                onInput={(
                  e,
                ) => (smtpPassword.value =
                  (e.target as HTMLInputElement).value)}
                placeholder="password"
                fullWidth
                variant="filled"
                size="md"
              />
            </>
          )}
        </div>

        <div class="mt-6">
          <Button
            type="button"
            variant="primary"
            size="md"
            loading={loading.value}
            onClick={() => handleSave("Email")}
          >
            Save Email Settings
          </Button>
        </div>
      </div>

      {/* Notification Settings */}
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Notification Settings
        </h2>

        <div class="space-y-4">
          <Input
            label="Admin Email"
            type="email"
            id="adminEmail"
            value={adminEmail.value}
            onInput={(
              e,
            ) => (adminEmail.value = (e.target as HTMLInputElement).value)}
            placeholder="admin@example.com"
            fullWidth
            variant="filled"
            size="md"
          />

          <Checkbox
            id="notifyOnNewUser"
            checked={notifyOnNewUser.value}
            onChange={(
              e,
            ) => (notifyOnNewUser.value =
              (e.target as HTMLInputElement).checked)}
            label="Notify on New User Registration"
            helperText="Send email notification when a new user registers"
          />

          <Checkbox
            id="notifyOnError"
            checked={notifyOnError.value}
            onChange={(
              e,
            ) => (notifyOnError.value = (e.target as HTMLInputElement).checked)}
            label="Notify on System Errors"
            helperText="Send email notification when critical errors occur"
          />
        </div>

        <div class="mt-6">
          <Button
            type="button"
            variant="primary"
            size="md"
            loading={loading.value}
            onClick={() => handleSave("Notification")}
          >
            Save Notification Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
