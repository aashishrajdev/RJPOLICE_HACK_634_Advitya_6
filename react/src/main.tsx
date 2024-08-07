import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App.tsx";
import "./index.css";
import {
  SignIn,
  ClerkProvider,
  SignUp,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import {
  Outlet,
  RouterProvider,
  Link,
  Router,
  Route,
  RootRoute,
} from "@tanstack/react-router";
import { Map } from "./map/syncfusion-map";
// import { Map } from "./map/leaflet-map";

//import { TanStackRouterDevtools } from "@tanstack/router-devtools";

// Import your publishable key

import { registerLicense } from "@syncfusion/ej2-base";

// Registering Syncfusion license key
registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NAaF5cWWJCfEx3Rnxbf1x0ZFBMY1VbR3BPIiBoS35RckViWHtfd3BWQmhYUEJ+"
);

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const rootRoute = new RootRoute();

const signInRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/sign-in",
  component: function SignInPage() {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />;
      </main>
    );
  },
});

const signUpRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/sign-up",
  component: function SignUpPage() {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />;
      </main>
    );
  },
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: function Index() {
    return (
      <div className="p-2">
        <h3>Welcome Home!</h3>
        <SignedOut>
          <Link to="/sign-in">
            <Button>Sign In</Button>
          </Link>
        </SignedOut>
        <SignedIn>
          <Link to="/app">
            <Button>Go To App</Button>
          </Link>
        </SignedIn>
      </div>
    );
  },
});

// /app/-> Routes

const appRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/app",
  component: function AppPage() {
    return (
      <main className="grid grid-cols-7 min-h-screen">
        <nav className="flex flex-col gap-3 linear-gradient(0deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.60) 100%), linear-gradient(136deg, rgba(252, 73, 73, 0.24) 49.52%, rgba(83, 56, 248, 0.10) 51.87%, rgba(16, 64, 255, 0.00) 77.07%, rgba(98, 27, 39, 0.00) 77.07%)">
          <Link to="/app/" className="[&.active]:font-bold">
            Home
          </Link>{" "}
          <Link to="/app/about" className="[&.active]:font-bold">
            About
          </Link>
          <Link to="/app/map" className="[&.active]:font-bold">
            Map
          </Link>
        </nav>
        <div className="col-span-6 border-l">
          <Outlet />
        </div>
      </main>
    );
  },
});

const homeRoute = new Route({
  getParentRoute: () => appRoute,
  path: "/",
  component: function Index() {
    const containerStyle = {
      backgroundImage:
        "linear-gradient(0deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.60) 100%), linear-gradient(136deg, rgba(252, 73, 73, 0.24) 49.52%, rgba(83, 56, 248, 0.10) 51.87%, rgba(16, 64, 255, 0.00) 77.07%, rgba(98, 27, 39, 0.00) 77.07%)",
    };

    return (
      <div
        style={containerStyle}
        className="flex flex-col justify-center items-center h-screen bg-gray-200"
      >
        <h3 className="text-4xl font-bold text-black mb-4">Rajasthan Police</h3>
        <h2 className="text-4xl font-bold text-black">CCTV Monitoring Panel</h2>
      </div>
    );
  },
});

const aboutRoute = new Route({
  getParentRoute: () => appRoute,
  path: "/about",
  component: function About() {
    const containerStyle = {
      backgroundImage:
        "linear-gradient(0deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.60) 100%), linear-gradient(136deg, rgba(252, 73, 73, 0.24) 49.52%, rgba(83, 56, 248, 0.10) 51.87%, rgba(16, 64, 255, 0.00) 77.07%, rgba(98, 27, 39, 0.00) 77.07%)",
    };

    return (
      <div
        style={containerStyle}
        className="flex flex-col justify-center items-center h-screen bg-gray-200"
      >
        <h3 className="text-4xl font-bold text-black mb-4">
          Welcome to our CCTV Monitoring Portal
        </h3>
        <h2 className="text-4xl font-bold text-black">
          Developed for the Rajasthan Police Hackathon!
        </h2>

        <div
          className="text-center"
          style={{
            width: 574,
            height: 469,
            color: "white",
            fontSize: 30,
            fontFamily: "Montserrat",
            fontWeight: "500",
            wordWrap: "break-word",
          }}
        >
          Welcome to our CCTV Monitoring Portal, developed for the Rajasthan
          Police Hackathon!
          <br />
          <br />
          Our cutting-edge web portal is designed to enhance surveillance
          capabilities, providing real-time monitoring and analysis of CCTV
          feeds. With a user-friendly interface, our solution empowers law
          enforcement agencies to maintain public safety and respond swiftly to
          potential threats.
        </div>
      </div>
    );
  },
});

const mapRoute = new Route({
  getParentRoute: () => appRoute,
  path: "/map",
  component: function MapPage() {
    return (
      <div className="min-h-screen ">
        <Map />
        {/* <Map
          coords={{ latitude: 28.605875, longitude: 77.369809 }}
          display_name="Noida"
        /> */}
      </div>
    );
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  // rootRoute,
  signInRoute,
  signUpRoute,
  appRoute.addChildren([aboutRoute, homeRoute, mapRoute]),
]);

const router = new Router({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>
);
