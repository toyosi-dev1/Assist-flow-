import React, { useState } from 'react';
import {
  Plane,
  Building2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Edit2,
  ShieldCheck,
  User,
  Compass,
  FileCheck
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { TravelTrip, ItineraryItem } from '../types';
import { formatDisplayDate, getTodayString } from '../utils/dateUtils';
import { Modal } from '../components/common/Modal';

export const TravelPage: React.FC = () => {
  const {
    travelTrips,
    toggleTripChecklist,
    addItineraryItem,
    deleteItineraryItem,
    updateTravelTrip
  } = useWorkspace();

  const [activeTripIndex, setActiveTripIndex] = useState(0);
  const trip = travelTrips[activeTripIndex] || travelTrips[0];

  const [itineraryModalOpen, setItineraryModalOpen] = useState(false);
  const [itinDate, setItinDate] = useState(getTodayString());
  const [itinTime, setItinTime] = useState('12:00 BST');
  const [itinActivity, setItinActivity] = useState('');
  const [itinLocation, setItinLocation] = useState('');
  const [itinNotes, setItinNotes] = useState('');

  const [editTripModalOpen, setEditTripModalOpen] = useState(false);
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [traveler, setTraveler] = useState('');
  const [purpose, setPurpose] = useState('');
  const [airline, setAirline] = useState('');
  const [flightRef, setFlightRef] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [hotelAddress, setHotelAddress] = useState('');
  const [hotelRef, setHotelRef] = useState('');

  const openEditTripModal = () => {
    if (!trip) return;
    setTripName(trip.tripName);
    setDestination(trip.destination);
    setTraveler(trip.traveler);
    setPurpose(trip.purpose);
    setAirline(trip.transportation.airline);
    setFlightRef(trip.transportation.flightReference);
    setHotelName(trip.accommodation.hotelName);
    setHotelAddress(trip.accommodation.address);
    setHotelRef(trip.accommodation.confirmationReference);
    setEditTripModalOpen(true);
  };

  const handleSaveTripDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip) return;
    updateTravelTrip({
      ...trip,
      tripName,
      destination,
      traveler,
      purpose,
      transportation: {
        ...trip.transportation,
        airline,
        flightReference: flightRef
      },
      accommodation: {
        ...trip.accommodation,
        hotelName,
        address: hotelAddress,
        confirmationReference: hotelRef
      }
    });
    setEditTripModalOpen(false);
  };

  const handleAddItinerary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itinActivity.trim() || !trip) return;
    addItineraryItem(trip.id, {
      date: itinDate,
      time: itinTime.trim() || 'TBD',
      activity: itinActivity.trim(),
      location: itinLocation.trim(),
      notes: itinNotes.trim()
    });
    setItinActivity('');
    setItinLocation('');
    setItinNotes('');
    setItineraryModalOpen(false);
  };

  if (!trip) {
    return (
      <div className="p-12 text-center text-stone-400">
        No travel itineraries configured.
      </div>
    );
  }

  const completedChecklistCount = trip.checklist.filter(c => c.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded uppercase tracking-wider">
              Sample Trip • Fictional Demonstration
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            {trip.tripName}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            {trip.destination} • Traveler: <strong className="text-stone-800">{trip.traveler}</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={openEditTripModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs sm:text-sm font-medium rounded-lg shadow-xs cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Edit2 className="w-4 h-4 text-stone-500" />
          <span>Edit Trip Parameters</span>
        </button>
      </div>

      <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-950">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Fictional Demonstration Itinerary</p>
          <p className="text-stone-600 mt-0.5">
            All flight references, passenger designations, and hotel reservations represent realistic sample executive data for Virtual Assistant workflow evaluation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#E8E2D5] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-50 text-amber-900 rounded-lg">
                <Plane className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-stone-900">Commercial Flight Dossier</h2>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 bg-stone-100 text-stone-700 rounded border border-stone-200">
              {trip.transportation.flightReference}
            </span>
          </div>

          <div className="space-y-3 text-xs text-stone-700">
            <div className="flex items-center justify-between p-3 bg-[#FAF8F5] border border-stone-200 rounded-lg">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Outbound Airline</span>
                <p className="text-sm font-bold text-stone-900 mt-0.5">{trip.transportation.airline}</p>
                <p className="text-stone-500 text-[11px]">{trip.transportation.departureAirport}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Destination Arrival</span>
                <p className="text-sm font-bold text-stone-900 mt-0.5">{trip.destination}</p>
                <p className="text-stone-500 text-[11px]">{trip.transportation.arrivalAirport}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="p-2.5 bg-[#FAF8F5] border border-stone-200 rounded-lg">
                <span className="text-stone-400 font-semibold block text-[10px]">Scheduled Departure</span>
                <p className="font-semibold text-stone-800 mt-0.5">{trip.transportation.departureDateTime}</p>
              </div>
              <div className="p-2.5 bg-[#FAF8F5] border border-stone-200 rounded-lg">
                <span className="text-stone-400 font-semibold block text-[10px]">Estimated Arrival</span>
                <p className="font-semibold text-stone-800 mt-0.5">{trip.transportation.arrivalDateTime}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E8E2D5] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-50 text-amber-900 rounded-lg">
                <Building2 className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-stone-900">Executive Lodging</h2>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 bg-stone-100 text-stone-700 rounded border border-stone-200">
              {trip.accommodation.confirmationReference}
            </span>
          </div>

          <div className="space-y-3 text-xs text-stone-700">
            <div className="p-3 bg-[#FAF8F5] border border-stone-200 rounded-lg space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Hotel Property</span>
              <p className="text-sm font-bold text-stone-900">{trip.accommodation.hotelName}</p>
              <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                <span>{trip.accommodation.address}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="p-2.5 bg-[#FAF8F5] border border-stone-200 rounded-lg">
                <span className="text-stone-400 font-semibold block text-[10px]">Check-In Window</span>
                <p className="font-semibold text-stone-800 mt-0.5">{trip.accommodation.checkIn}</p>
              </div>
              <div className="p-2.5 bg-[#FAF8F5] border border-stone-200 rounded-lg">
                <span className="text-stone-400 font-semibold block text-[10px]">Check-Out Date</span>
                <p className="font-semibold text-stone-800 mt-0.5">{trip.accommodation.checkOut}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#E8E2D5] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-800" />
              <h2 className="text-sm font-bold text-stone-900">Trip Schedule & Daily Itinerary</h2>
            </div>
            <button
              type="button"
              onClick={() => setItineraryModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-medium cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Itinerary Item</span>
            </button>
          </div>

          <div className="space-y-3">
            {trip.itinerary.map(item => (
              <div
                key={item.id}
                className="p-3.5 bg-[#FAF8F5] border border-stone-200 rounded-lg flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs group"
              >
                <div className="flex items-start gap-3">
                  <div className="px-2.5 py-1 bg-white border border-stone-200 rounded text-center shrink-0">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Time</span>
                    <span className="font-bold text-stone-800">{item.time}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">{item.activity}</h3>
                    <div className="flex items-center gap-1.5 text-stone-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{item.location}</span>
                    </div>
                    {item.notes && (
                      <p className="text-stone-600 mt-1.5 text-[11px] leading-relaxed bg-white/70 p-2 rounded border border-stone-200/60">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => deleteItineraryItem(trip.id, item.id)}
                  className="self-end sm:self-start p-1 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                  title="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-xl border border-[#E8E2D5] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-amber-800" />
              <h2 className="text-sm font-bold text-stone-900">Executive Pre-Departure Checklist</h2>
            </div>
            <span className="text-xs font-semibold text-stone-500">
              {completedChecklistCount}/{trip.checklist.length}
            </span>
          </div>

          <div className="space-y-2">
            {trip.checklist.map(item => (
              <div
                key={item.id}
                onClick={() => toggleTripChecklist(trip.id, item.id)}
                className="p-2.5 bg-[#FAF8F5] border border-stone-200 hover:bg-stone-50 rounded-lg flex items-start gap-2.5 cursor-pointer text-xs transition-colors"
              >
                {item.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-4 h-4 text-stone-300 shrink-0 mt-0.5" />
                )}
                <span className={item.completed ? 'line-through text-stone-400' : 'text-stone-800 font-medium'}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={itineraryModalOpen}
        onClose={() => setItineraryModalOpen(false)}
        title="Add Itinerary Activity"
        maxWidth="md"
      >
        <form onSubmit={handleAddItinerary} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={itinDate}
                onChange={e => setItinDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Time</label>
              <input
                type="text"
                required
                value={itinTime}
                onChange={e => setItinTime(e.target.value)}
                placeholder="10:00 BST"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Activity Title <span className="text-amber-700">*</span></label>
            <input
              type="text"
              required
              value={itinActivity}
              onChange={e => setItinActivity(e.target.value)}
              placeholder="e.g., European Institutional Investor Summit Keynote"
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Location / Venue</label>
            <input
              type="text"
              value={itinLocation}
              onChange={e => setItinLocation(e.target.value)}
              placeholder="e.g., The Savoy, Strand, London"
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Special Notes / Protocols</label>
            <textarea
              rows={2}
              value={itinNotes}
              onChange={e => setItinNotes(e.target.value)}
              placeholder="Driver details, dress code, speaker requirements..."
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setItineraryModalOpen(false)}
              className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-amber-800 hover:bg-amber-900 text-white rounded-lg cursor-pointer"
            >
              Add Activity
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={editTripModalOpen}
        onClose={() => setEditTripModalOpen(false)}
        title="Edit Trip Parameters"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveTripDetails} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Trip Name</label>
              <input
                type="text"
                required
                value={tripName}
                onChange={e => setTripName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Destination</label>
              <input
                type="text"
                required
                value={destination}
                onChange={e => setDestination(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Traveler</label>
              <input
                type="text"
                required
                value={traveler}
                onChange={e => setTraveler(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Purpose</label>
              <input
                type="text"
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Airline Carrier</label>
              <input
                type="text"
                value={airline}
                onChange={e => setAirline(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Flight Reference</label>
              <input
                type="text"
                value={flightRef}
                onChange={e => setFlightRef(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Hotel Name</label>
              <input
                type="text"
                value={hotelName}
                onChange={e => setHotelName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Hotel Confirmation Ref</label>
              <input
                type="text"
                value={hotelRef}
                onChange={e => setHotelRef(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setEditTripModalOpen(false)}
              className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-amber-800 hover:bg-amber-900 text-white rounded-lg cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
