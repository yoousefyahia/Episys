'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faUsers,
  faClock,
  faArrowLeft,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import Navbar from '@/components/Navbar/Navbar';
import './BookTable.css';

export default function BookTable() {
  const { t, language } = useLanguage();
  const { success, error } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [bookingData, setBookingData] = useState({
    date: '',
    guests: 1,
    mealType: 'breakfast',
    timeSlot: '',
    specialRequest: '',
  });

  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate available dates for next 7 days (weekdays only)
  useEffect(() => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
          weekday: 'long',
        }),
      });
    }
    setAvailableDates(dates);
  }, [language]);

  // Generate time slots based on meal type
  useEffect(() => {
    const slots = [];

    switch (bookingData.mealType) {
      case 'breakfast':
        slots.push(
          '08:00 AM',
          '08:30 AM',
          '09:00 AM',
          '09:30 AM',
          '10:00 AM',
          '10:30 AM',
          '11:00 AM'
        );
        break;
      case 'lunch':
        slots.push(
          '12:00 PM',
          '12:30 PM',
          '01:00 PM',
          '01:30 PM',
          '02:00 PM',
          '02:30 PM',
          '03:00 PM'
        );
        break;
      case 'dinner':
        slots.push(
          '06:00 PM',
          '06:30 PM',
          '07:00 PM',
          '07:30 PM',
          '08:00 PM',
          '08:30 PM',
          '09:00 PM',
          '09:30 PM'
        );
        break;
      default:
        slots.push('08:00 AM', '12:00 PM', '06:00 PM');
    }

    setAvailableTimeSlots(slots);
  }, [bookingData.mealType]);

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Validation
    if (!bookingData.date) {
      error(t('selectDate'));
      return;
    }
    if (!bookingData.timeSlot) {
      error(t('selectTime'));
      return;
    }
    if (bookingData.guests < 1 || bookingData.guests > 20) {
      error(t('invalidGuests'));
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      success(t('bookingSuccess'));

      // Reset form
      setBookingData({
        date: '',
        guests: 1,
        mealType: 'breakfast',
        timeSlot: '',
        specialRequest: '',
      });
    } catch (err) {
      error(t('bookingError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    window.history.back();
  };

  if (!isClient) {
    return (
      <div className="book-table-container">
        <div className="loading-placeholder">
          <div className="loading-spinner"></div>
          <p>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="book-table-container"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Navbar />
      <div className="book-table-content-wrapper">
        <div className="book-table-header">
          <button className="back-button" onClick={goBack}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="book-table-title">{t('bookTable')}</h1>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2 className="section-title">{t('selectBookingDetails')}</h2>

            <div className="input-group">
              <div className="input-field">
                <FontAwesomeIcon icon={faCalendar} className="input-icon" />
                <select
                  value={bookingData.date}
                  onChange={e => handleInputChange('date', e.target.value)}
                  className="form-select"
                >
                  <option value="">{t('selectDate')}</option>
                  {availableDates.map(date => (
                    <option key={date.value} value={date.value}>
                      {date.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-field">
                <FontAwesomeIcon icon={faUsers} className="input-icon" />
                <select
                  value={bookingData.guests}
                  onChange={e =>
                    handleInputChange('guests', parseInt(e.target.value))
                  }
                  className="form-select"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? t('guest') : t('guests')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-field">
                <FontAwesomeIcon icon={faClock} className="input-icon" />
                <select
                  value={bookingData.mealType}
                  onChange={e => handleInputChange('mealType', e.target.value)}
                  className="form-select"
                >
                  <option value="breakfast">{t('breakfast')}</option>
                  <option value="lunch">{t('lunch')}</option>
                  <option value="dinner">{t('dinner')}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">{t('selectTimeSlot')}</h2>
            <div className="time-slots-grid">
              {availableTimeSlots.map(time => (
                <button
                  key={time}
                  type="button"
                  className={`time-slot ${bookingData.timeSlot === time ? 'selected' : ''}`}
                  onClick={() => handleInputChange('timeSlot', time)}
                >
                  {time}
                  {bookingData.timeSlot === time && (
                    <FontAwesomeIcon icon={faCheck} className="check-icon" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">{t('specialRequest')}</h2>
            <textarea
              value={bookingData.specialRequest}
              onChange={e =>
                handleInputChange('specialRequest', e.target.value)
              }
              className="special-request-textarea"
              placeholder={t('specialRequestPlaceholder')}
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className={`submit-button ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? t('bookingInProgress') : t('confirmBooking')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
