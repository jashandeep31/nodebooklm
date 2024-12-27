import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/chat");
    }
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <Link
            to={""}
            className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
            target="_blank"
          >
            Open Source
          </Link>
          <h1 className="font-medium   text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            NotebookLM your personal AI notebook.
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            NotebookLM is a personal AI notebook that allows you to ask
            questions from your own notes.
          </p>
          <div className="space-x-4">
            <Link to="/login" className={cn(buttonVariants({ size: "lg" }))}>
              Get Started
            </Link>
            <Link
              to={""}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              GitHub
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const Navbar = () => {
  return (
    <div className="border-b">
      <div className="container py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">NotebookLM</h1>
        <div>
          <div className="flex gap-3">
            <Link to={"/login"} className={buttonVariants()}>
              Login
            </Link>
            <Link
              to={"/login"}
              className={buttonVariants({ variant: "outline" })}
            >
              Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
