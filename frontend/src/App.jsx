import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  Droplets,
  LayoutDashboard,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Edit3,
  X,
  PackageCheck,
  Clock3,
  ChevronRight
} from 'lucide-react'

import { inventoryApi } from './api'

const groups = [
  ['A_POSITIVE', 'A+'],
  ['A_NEGATIVE', 'A-'],
  ['B_POSITIVE', 'B+'],
  ['B_NEGATIVE', 'B-'],
  ['AB_POSITIVE', 'AB+'],
  ['AB_NEGATIVE', 'AB-'],
  ['O_POSITIVE', 'O+'],
  ['O_NEGATIVE', 'O-']
]

const components = [
  ['WHOLE_BLOOD', 'Whole Blood'],
  ['RED_BLOOD_CELLS', 'Red Blood Cells'],
  ['PLASMA', 'Plasma'],
  ['PLATELETS', 'Platelets'],
  ['CRYOPRECIPITATE', 'Cryoprecipitate']
]

const emptyForm = {
  batchNumber: '',
  bloodGroup: 'O_POSITIVE',
  componentType: 'RED_BLOOD_CELLS',
  units: 1,
  collectionDate: '',
  expiryDate: '',
  storageLocation: '',
  status: 'AVAILABLE'
}

function prettyGroup(value) {
  return groups.find(([key]) => key === value)?.[1] ?? value
}

function prettyComponent(value) {
  return (
    components.find(([key]) => key === value)?.[1] ??
    value?.replaceAll('_', ' ')
  )
}

function formatDate(value) {
  if (!value) return '—'

  return new Date(value + 'T00:00:00').toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

function App() {
  const [activePage, setActivePage] = useState('dashboard')

  const [items, setItems] = useState([])
  const [summary, setSummary] = useState(null)

  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [groupFilter, setGroupFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  /*
   * ---------------------------------------------------------
   * LOAD DATA FROM SPRING BOOT
   * ---------------------------------------------------------
   */

  const load = async () => {
    setLoading(true)
    setError('')

    try {
      const [listResponse, dashboardResponse] = await Promise.all([
        inventoryApi.list(),
        inventoryApi.dashboard()
      ])

      setItems(listResponse.data)
      setSummary(dashboardResponse.data)
    } catch (e) {
      console.error(e)

      setError(
        'Could not connect to the backend. Make sure Spring Boot is running on port 8080.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  /*
   * ---------------------------------------------------------
   * FILTER INVENTORY
   * ---------------------------------------------------------
   */

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const q = query.toLowerCase()

      const matchesQuery =
        !q ||
        item.batchNumber.toLowerCase().includes(q) ||
        item.storageLocation.toLowerCase().includes(q)

      const matchesGroup =
        groupFilter === 'ALL' ||
        item.bloodGroup === groupFilter

      const matchesStatus =
        statusFilter === 'ALL' ||
        item.status === statusFilter

      return matchesQuery && matchesGroup && matchesStatus
    })
  }, [items, query, groupFilter, statusFilter])

  /*
   * ---------------------------------------------------------
   * CREATE / EDIT
   * ---------------------------------------------------------
   */

  const openCreate = () => {
    const today = new Date()

    const expiry = new Date(
      today.getTime() + 35 * 24 * 60 * 60 * 1000
    )

    setForm({
      ...emptyForm,
      collectionDate: today.toISOString().slice(0, 10),
      expiryDate: expiry.toISOString().slice(0, 10)
    })

    setModal({
      mode: 'create'
    })
  }

  const openEdit = (item) => {
    setForm({
      ...item,
      units: item.units
    })

    setModal({
      mode: 'edit',
      id: item.id
    })
  }

  /*
   * ---------------------------------------------------------
   * SUBMIT FORM
   * ---------------------------------------------------------
   */

  const submit = async (event) => {
    event.preventDefault()

    setError('')

    try {
      const payload = {
        ...form,
        units: Number(form.units)
      }

      if (modal.mode === 'create') {
        await inventoryApi.create(payload)

        showToast('Inventory batch added successfully')
      } else {
        await inventoryApi.update(modal.id, payload)

        showToast('Inventory batch updated successfully')
      }

      setModal(null)

      await load()
    } catch (e) {
      console.error(e)

      const message =
        e.response?.data?.error ||
        Object.values(e.response?.data || {}).join(', ') ||
        'Request failed'

      setError(message)
    }
  }

  /*
   * ---------------------------------------------------------
   * DELETE
   * ---------------------------------------------------------
   */

  const remove = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this inventory batch?'
    )

    if (!confirmed) return

    try {
      await inventoryApi.remove(id)

      showToast('Inventory batch deleted')

      await load()
    } catch (e) {
      console.error(e)

      setError(
        e.response?.data?.error ||
        'Could not delete the inventory batch.'
      )
    }
  }

  /*
   * ---------------------------------------------------------
   * TOAST
   * ---------------------------------------------------------
   */

  const showToast = (message) => {
    setToast(message)

    setTimeout(() => {
      setToast('')
    }, 2500)
  }

  /*
   * ---------------------------------------------------------
   * NAVIGATION
   * ---------------------------------------------------------
   */

  const navigate = (page) => {
    setActivePage(page)

    // Clear filters when leaving inventory
    if (page !== 'inventory') {
      setQuery('')
      setGroupFilter('ALL')
      setStatusFilter('ALL')
    }
  }

  /*
   * ---------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------
   */

  return (
    <div className="app-shell">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-mark">
            <Droplets size={22} />
          </div>

          <div>
            <strong>hemora</strong>
            <span>blood bank</span>
          </div>

        </div>


        <nav>

          <button
            className={`nav-item ${
              activePage === 'dashboard' ? 'active' : ''
            }`}
            onClick={() => navigate('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>


          <button
            className={`nav-item ${
              activePage === 'inventory' ? 'active' : ''
            }`}
            onClick={() => navigate('inventory')}
          >
            <PackageCheck size={18} />
            <span>Inventory</span>
          </button>


          <button
            className={`nav-item ${
              activePage === 'availability' ? 'active' : ''
            }`}
            onClick={() => navigate('availability')}
          >
            <Activity size={18} />
            <span>Availability</span>
          </button>

        </nav>


        <div className="sidebar-footer">

          <div className="status-dot"></div>

          <div>
            <strong>System online</strong>
            <span>Hospital Blood Bank</span>
          </div>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="main">

        {/* TOP BAR */}

        <header className="topbar">

          <div>

            <div className="eyebrow">
              OPERATIONS / {activePage.toUpperCase()}
            </div>

            <h1>
              {activePage === 'dashboard' && 'Blood inventory'}

              {activePage === 'inventory' && 'Inventory management'}

              {activePage === 'availability' && 'Blood availability'}
            </h1>

            <p>
              {activePage === 'dashboard' &&
                'Monitor, maintain and allocate blood component stock.'}

              {activePage === 'inventory' &&
                'Manage blood batches, storage records and inventory status.'}

              {activePage === 'availability' &&
                'View available blood units by blood group and component.'}
            </p>

          </div>


          <div className="top-actions">

            <button
              className="icon-button"
              onClick={load}
              title="Refresh data"
            >
              <RefreshCw size={18} />
            </button>


            <button
              className="primary"
              onClick={openCreate}
            >
              <Plus size={18} />
              Add batch
            </button>

          </div>

        </header>


        {/* ERROR */}

        {error && (

          <div className="alert">

            <AlertTriangle size={18} />

            <span>{error}</span>

            <button
              onClick={() => setError('')}
            >
              <X size={16} />
            </button>

          </div>

        )}


        {/* TOAST */}

        {toast && (
          <div className="toast">
            {toast}
          </div>
        )}


        {/* =====================================================
            DASHBOARD
        ====================================================== */}

        {activePage === 'dashboard' && (

          <>

            <section className="metrics">

              <Metric
                icon={<Droplets />}
                label="Available units"
                value={summary?.totalAvailableUnits ?? '—'}
                note="Across all components"
              />

              <Metric
                icon={<PackageCheck />}
                label="Available batches"
                value={summary?.availableBatches ?? '—'}
                note="Ready for issue"
              />

              <Metric
                icon={<Clock3 />}
                label="Expiring soon"
                value={summary?.expiringSoon ?? '—'}
                note="Within next 7 days"
                warning
              />

              <Metric
                icon={<AlertTriangle />}
                label="Expired batches"
                value={summary?.expiredBatches ?? '—'}
                note="Requires disposal"
                danger
              />

            </section>


            <BloodGroupCards summary={summary} />


            <section className="panel">

              <div className="panel-head">

                <div>
                  <h2>Recent inventory</h2>
                  <span>
                    {items.length} total records
                  </span>
                </div>


                <button
                  className="secondary"
                  onClick={() => navigate('inventory')}
                >
                  View inventory
                  <ChevronRight size={15} />
                </button>

              </div>


              <InventoryTable
                items={items.slice(0, 5)}
                loading={loading}
                onEdit={openEdit}
                onDelete={remove}
              />

            </section>

          </>

        )}


        {/* =====================================================
            INVENTORY
        ====================================================== */}

        {activePage === 'inventory' && (

          <section className="panel">

            <div className="panel-head">

              <div>
                <h2>Inventory batches</h2>

                <span>
                  {filtered.length} records shown
                </span>
              </div>


              <div className="filters">

                <div className="search">

                  <Search size={17} />

                  <input
                    placeholder="Search batch or location..."
                    value={query}
                    onChange={(e) =>
                      setQuery(e.target.value)
                    }
                  />

                </div>


                <select
                  value={groupFilter}
                  onChange={(e) =>
                    setGroupFilter(e.target.value)
                  }
                >

                  <option value="ALL">
                    All groups
                  </option>

                  {groups.map(([key, label]) => (
                    <option
                      key={key}
                      value={key}
                    >
                      {label}
                    </option>
                  ))}

                </select>


                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                >

                  <option value="ALL">
                    All status
                  </option>

                  <option value="AVAILABLE">
                    Available
                  </option>

                  <option value="RESERVED">
                    Reserved
                  </option>

                  <option value="QUARANTINED">
                    Quarantined
                  </option>

                  <option value="EXPIRED">
                    Expired
                  </option>

                </select>

              </div>

            </div>


            <InventoryTable
              items={filtered}
              loading={loading}
              onEdit={openEdit}
              onDelete={remove}
            />

          </section>

        )}


        {/* =====================================================
            AVAILABILITY
        ====================================================== */}

        {activePage === 'availability' && (

          <>

            <BloodGroupCards summary={summary} />


            <section className="panel">

              <div className="panel-head">

                <div>
                  <h2>Available blood stock</h2>

                  <span>
                    Currently available inventory
                  </span>
                </div>

              </div>


              <div className="availability-grid">

                {groups.map(([key, label]) => {

                  const units =
                    summary?.availableUnitsByBloodGroup?.[key] ?? 0

                  const percentage =
                    summary?.totalAvailableUnits
                      ? Math.round(
                          (units /
                            summary.totalAvailableUnits) *
                            100
                        )
                      : 0

                  return (

                    <div
                      className="availability-card"
                      key={key}
                    >

                      <div className="availability-header">

                        <span className="blood-symbol large">
                          {label}
                        </span>

                        <div>

                          <strong>
                            {units} units
                          </strong>

                          <span>
                            available
                          </span>

                        </div>

                      </div>


                      <div className="availability-bar">

                        <div
                          style={{
                            width: `${percentage}%`
                          }}
                        />

                      </div>


                      <div className="availability-footer">

                        <span>
                          {percentage}% of available stock
                        </span>

                        <button
                          onClick={() => {
                            setGroupFilter(key)
                            setStatusFilter('AVAILABLE')
                            setQuery('')
                            setActivePage('inventory')
                          }}
                        >
                          View batches
                          <ChevronRight size={13} />
                        </button>

                      </div>

                    </div>

                  )

                })}

              </div>

            </section>

          </>

        )}

      </main>


      {/* =====================================================
          ADD / EDIT MODAL
      ====================================================== */}

      {modal && (

        <div
          className="modal-backdrop"
          onMouseDown={(e) => {

            if (e.target === e.currentTarget) {
              setModal(null)
            }

          }}
        >

          <div className="modal">

            <div className="modal-head">

              <div>

                <div className="eyebrow">
                  INVENTORY RECORD
                </div>

                <h2>
                  {modal.mode === 'create'
                    ? 'Add blood batch'
                    : 'Edit blood batch'}
                </h2>

              </div>


              <button
                onClick={() => setModal(null)}
              >
                <X />
              </button>

            </div>


            <form onSubmit={submit}>

              <div className="form-grid">

                <label>

                  Batch number

                  <input
                    required
                    value={form.batchNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        batchNumber: e.target.value
                      })
                    }
                    placeholder="BB-2026-007"
                  />

                </label>


                <label>

                  Blood group

                  <select
                    value={form.bloodGroup}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bloodGroup: e.target.value
                      })
                    }
                  >

                    {groups.map(([key, label]) => (

                      <option
                        key={key}
                        value={key}
                      >
                        {label}
                      </option>

                    ))}

                  </select>

                </label>


                <label>

                  Component

                  <select
                    value={form.componentType}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        componentType: e.target.value
                      })
                    }
                  >

                    {components.map(
                      ([key, label]) => (

                        <option
                          key={key}
                          value={key}
                        >
                          {label}
                        </option>

                      )
                    )}

                  </select>

                </label>


                <label>

                  Units

                  <input
                    required
                    min="0"
                    type="number"
                    value={form.units}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        units: e.target.value
                      })
                    }
                  />

                </label>


                <label>

                  Collection date

                  <input
                    required
                    type="date"
                    value={form.collectionDate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        collectionDate: e.target.value
                      })
                    }
                  />

                </label>


                <label>

                  Expiry date

                  <input
                    required
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        expiryDate: e.target.value
                      })
                    }
                  />

                </label>


                <label className="wide">

                  Storage location

                  <input
                    required
                    value={form.storageLocation}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        storageLocation: e.target.value
                      })
                    }
                    placeholder="Cold Room A"
                  />

                </label>


                <label>

                  Status

                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value
                      })
                    }
                  >

                    <option value="AVAILABLE">
                      Available
                    </option>

                    <option value="RESERVED">
                      Reserved
                    </option>

                    <option value="QUARANTINED">
                      Quarantined
                    </option>

                    <option value="EXPIRED">
                      Expired
                    </option>

                  </select>

                </label>

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary"
                  onClick={() => setModal(null)}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="primary"
                >
                  {modal.mode === 'create'
                    ? 'Add batch'
                    : 'Save changes'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}


/*
 * =========================================================
 * METRIC CARD
 * =========================================================
 */

function Metric({
  icon,
  label,
  value,
  note,
  warning,
  danger
}) {

  return (

    <div
      className={`metric ${
        warning ? 'warning' : ''
      } ${
        danger ? 'danger' : ''
      }`}
    >

      <div className="metric-icon">
        {icon}
      </div>

      <div>

        <span>{label}</span>

        <strong>{value}</strong>

        <small>{note}</small>

      </div>

    </div>

  )
}


/*
 * =========================================================
 * BLOOD GROUP CARDS
 * =========================================================
 */

function BloodGroupCards({ summary }) {

  return (

    <section className="group-strip">

      {groups.map(([key, label]) => (

        <div
          className="group-card"
          key={key}
        >

          <span className="blood-symbol">
            {label}
          </span>

          <div>

            <strong>
              {summary?.availableUnitsByBloodGroup?.[key] ?? 0}
            </strong>

            <span>
              units
            </span>

          </div>

        </div>

      ))}

    </section>

  )
}


/*
 * =========================================================
 * INVENTORY TABLE
 * =========================================================
 */

function InventoryTable({
  items,
  loading,
  onEdit,
  onDelete
}) {

  if (loading) {

    return (
      <div className="empty">
        Loading inventory...
      </div>
    )

  }


  if (!items || items.length === 0) {

    return (
      <div className="empty">
        No inventory batches found.
      </div>
    )

  }


  return (

    <div className="table-wrap">

      <table>

        <thead>

          <tr>

            <th>Batch</th>
            <th>Group</th>
            <th>Component</th>
            <th>Units</th>
            <th>Expiry</th>
            <th>Storage</th>
            <th>Status</th>
            <th></th>

          </tr>

        </thead>


        <tbody>

          {items.map((item) => (

            <tr key={item.id}>

              <td>

                <strong>
                  {item.batchNumber}
                </strong>

                <small>
                  ID #{item.id}
                </small>

              </td>


              <td>

                <span className="group-pill">
                  {prettyGroup(item.bloodGroup)}
                </span>

              </td>


              <td>
                {prettyComponent(item.componentType)}
              </td>


              <td>
                <strong>{item.units}</strong>
              </td>


              <td>
                {formatDate(item.expiryDate)}
              </td>


              <td>
                {item.storageLocation}
              </td>


              <td>
                <Status value={item.status} />
              </td>


              <td>

                <div className="row-actions">

                  <button
                    onClick={() => onEdit(item)}
                    title="Edit"
                  >
                    <Edit3 size={16} />
                  </button>


                  <button
                    onClick={() => onDelete(item.id)}
                    title="Delete"
                    className="delete"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )
}


/*
 * =========================================================
 * STATUS
 * =========================================================
 */

function Status({ value }) {

  const label =
    value?.charAt(0) +
    value?.slice(1).toLowerCase()

  return (

    <span
      className={`status ${
        value?.toLowerCase()
      }`}
    >
      {label}
    </span>

  )
}


export default App