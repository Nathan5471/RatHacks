import OrganizerNavbar from "../components/OrganizerNavbar";

export default function OrganizerDashboard() {
  return (
    <div className="w-screen h-screen flex flex-row bg-surface-a0 text-white">
      <div className="w-1/6 h-full">
        <OrganizerNavbar />
      </div>
      <div className="w-5/6 h-full flex flex-col p-4 items-center"></div>
    </div>
  );
}
