import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import DashboardLayout from "./layouts/DashboardLayout"
import DashboardPage from "./pages/dashboard/DashboardPage"
import RepertorioPage from "./pages/dashboard/RepertorioPage"
import DetallesCancionPage from "./pages/dashboard/DetallesCancionPage"
import ProgramacionesPage from "./pages/dashboard/ProgramacionesPage"
import NuevaProgramacionPage from "./pages/dashboard/NuevaProgramacionPage"
import DetallesProgramacionPage from "./pages/dashboard/DetallesProgramacionPage"
import EditarProgramacionPage from "./pages/dashboard/EditarProgramacionPage"
import EquipoPage from "./pages/dashboard/EquipoPage"
import ConfiguracionPage from "./pages/dashboard/ConfiguracionPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="repertorio" element={<RepertorioPage />} />
        <Route path="repertorio/:id" element={<DetallesCancionPage />} />
        <Route path="programaciones" element={<ProgramacionesPage />} />
        <Route path="programaciones/nueva" element={<NuevaProgramacionPage />} />
        <Route path="programaciones/:id" element={<DetallesProgramacionPage />} />
        <Route path="programaciones/:id/editar" element={<EditarProgramacionPage />} />
        <Route path="equipo" element={<EquipoPage />} />
        <Route path="configuracion" element={<ConfiguracionPage />} />
      </Route>
    </Routes>
  )
}

export default App
