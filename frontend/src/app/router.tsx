import { createBrowserRouter } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Workflows from "../pages/Workflows";
import Executions from "../pages/Executions";
import Providers from "../pages/Providers";
import WorkflowEditor from "../pages/WorkflowEditor";
import ExecutionInspector from "../pages/ExecutionInspector";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "workflows", element: <Workflows /> },
      { path: "workflows/:id", element: <WorkflowEditor /> },
      { path: "executions", element: <Executions /> },
      { path: "providers", element: <Providers /> },
      { path: "executions/:id", element: <ExecutionInspector /> },
    ],
  },
]);