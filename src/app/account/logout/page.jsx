import useAuth from "@/utils/useAuth";

function MainComponent() {
  const { signOut } = useAuth();
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F8FAFC] p-4 font-poppins">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-100 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">Sign Out</h1>
        <p className="text-gray-500 mb-8">
          Are you sure you want to sign out of DELIVA?
        </p>

        <div className="space-y-4">
          <button
            onClick={handleSignOut}
            className="w-full rounded-lg bg-[#0A84FF] px-4 py-3 text-base font-semibold text-white transition-all hover:bg-[#0070E0] focus:outline-none"
          >
            Yes, Sign Me Out
          </button>
          <a
            href="/dashboard"
            className="block w-full rounded-lg bg-gray-100 px-4 py-3 text-base font-semibold text-gray-700 transition-all hover:bg-gray-200"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
