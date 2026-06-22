import { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { createClaim } from "../Services/Api";

function Claims() {
    const { user } = useContext(AuthContext);

    const [form, setForm] = useState({
        full_name: user?.nombre || "",
        email: user?.email || "",
        phone: "",
        claim_type: "Reclamo",
        description: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await createClaim(form);

        alert("Reclamo enviado correctamente");

        setForm({
            full_name: user?.nombre || "",
            email: user?.email || "",
            phone: "",
            claim_type: "Reclamo",
            description: ""
        });
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">

                    <div className="card shadow-sm border-0">
                        
                        <div className="card-header bg-primary text-white text-center">
                            <h4 className="mb-0">Libro de Reclamaciones</h4>
                        </div>

                        <div className="card-body p-4">

                            <form onSubmit={handleSubmit}>

                                <input
                                    className="form-control mb-3"
                                    name="full_name"
                                    value={form.full_name}
                                    onChange={handleChange}
                                    placeholder="Nombre completo"
                                />

                                <input
                                    className="form-control mb-3"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Correo"
                                />

                                <input
                                    className="form-control mb-3"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="Teléfono"
                                />

                                <select
                                    className="form-control mb-3"
                                    name="claim_type"
                                    value={form.claim_type}
                                    onChange={handleChange}
                                >
                                    <option value="Reclamo">Reclamo</option>
                                    <option value="Queja">Queja</option>
                                </select>

                                <textarea
                                    className="form-control mb-3"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Describe tu reclamo"
                                    rows="4"
                                />

                                <button className="btn btn-primary w-100 py-2 fw-semibold">
                                    Enviar reclamo
                                </button>

                            </form>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Claims;
