import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './CreateGroup.css'

function CreateGroup() {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  return (
    <main className="create-group-page">
      <section className="create-group-card">
        <div className="create-group-header">
          <p className="eyebrow">Create your group</p>
          <h1>Set up your meeting</h1>
          <p className="create-group-description">
            Choose the basic meeting details.
          </p>
        </div>

        <form className="create-group-form">
          <div className="form-field">
            <label htmlFor="groupName">Group name</label>
            <input
              id="groupName"
              type="text"
              placeholder="e.g. Study group"
            />
          </div>

          <div className="form-field">
            <label>Date range</label>

            <div className="date-range">
              <div className="date-input">
                <label>From</label>

                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date)

                    if (endDate && date > endDate) {
                      setEndDate(null)
                    }
                  }}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  minDate={new Date()}
                  placeholderText="Select start date"
                  dateFormat="dd/MM/yyyy"
                />
              </div>

              <div className="date-input">
                <label>To</label>

                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate || new Date()}
                  placeholderText="Select end date"
                  dateFormat="dd/MM/yyyy"
                  disabled={!startDate}
                />
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="secondary-button">
              Cancel
            </button>

            <button type="submit" className="primary-button">
              Create group
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default CreateGroup