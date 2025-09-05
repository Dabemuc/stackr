export default function UnderConstruction() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-24 h-24 text-accent-gradiant-to mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3l-8.47-14.14a2 2 0 00-3.42 0z"
        />
      </svg>
      <h1 className="text-2xl font-semibold mb-2">Page Under Construction</h1>
      <p className="text-gray-600">
        We’re working on this page. Please check back soon!
      </p>
    </div>
  );
}
