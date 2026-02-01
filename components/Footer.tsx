export default function Footer() {
  return (
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div class="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 text-sm text-gray-600">
            <a
              href="/"
              class="hover:text-indigo-600 transition-colors touch-manipulation"
            >
              Home
            </a>
            <a
              href="/privacy"
              class="hover:text-indigo-600 transition-colors touch-manipulation"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              class="hover:text-indigo-600 transition-colors touch-manipulation"
            >
              Terms of Service
            </a>
          </div>
          <p class="text-sm text-gray-500 text-center sm:text-right">
            © {new Date().getFullYear()} Getlnk. Open-source link-in-bio.
          </p>
        </div>
      </div>
    </footer>
  );
}
