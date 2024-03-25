import { Signup } from "../_components/Signup/Signup";

export default async function Home() {
    return (
        <main className="p-6 flex items-center w-full">
            <Signup />
        </main>
    );
}