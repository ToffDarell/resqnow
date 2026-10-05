import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import {
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';

import {
  useAuth,
} from '../../context/AuthContext';

import {
  getAssignedReports,
} from '../../services/responderService';

import ResponderAssignedMap
  from './ResponderAssignedMap';

import {
  isOpenReport,
  sortOperationalReports,
  validCoordinates,
} from './responderViewUtils';

export default function ResponderFullMap() {
  const {
    user,
  } = useAuth();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [
    searchParams,
  ] = useSearchParams();

  const [
    reports,
    setReports,
  ] = useState([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  const q =
    (
      searchParams.get(
        'q'
      ) || ''
    )
      .trim()
      .toLowerCase();

  const type =
    searchParams.get(
      'type'
    ) || 'all';

  const priority =
    searchParams.get(
      'priority'
    ) || 'all';

  const load =
    useCallback(
      async () => {
        setError('');
        setIsLoading(
          true
        );

        try {
          const data =
            await getAssignedReports();

          setReports(
            data
          );
        } catch (
          requestError
        ) {
          setError(
            requestError?.message ||
            'Unable to load assigned map.'
          );
        } finally {
          setIsLoading(
            false
          );
        }
      },
      []
    );

  useEffect(
    () => {
      load();
    },
    [
      load,
    ]
  );

  const filtered =
    useMemo(
      () => {
        const open =
          sortOperationalReports(
            reports.filter(
              isOpenReport
            ),
            user?.id
          );

        return open.filter(
          (
            report
          ) => {
            const matchesType =
              type ===
                'all' ||
              report.reportType ===
                type;

            const matchesPriority =
              priority ===
                'all' ||
              report.priority ===
                priority;

            const matchesSearch =
              !q ||
              report.id
                ?.toLowerCase()
                .includes(
                  q
                ) ||
              report.concernType
                ?.toLowerCase()
                .includes(
                  q
                ) ||
              report.location
                ?.toLowerCase()
                .includes(
                  q
                ) ||
              report.landmark
                ?.toLowerCase()
                .includes(
                  q
                );

            return (
              matchesType &&
              matchesPriority &&
              matchesSearch
            );
          }
        );
      },
      [
        reports,
        user?.id,
        q,
        type,
        priority,
      ]
    );

  const mappedCount =
    filtered.filter(
      (
        report
      ) =>
        validCoordinates(
          report
        )
    ).length;

  function goBack() {
    if (
      location.state
        ?.returnTo
    ) {
      navigate(-1);
      return;
    }

    navigate(
      '/responder/missions'
    );
  }

  function openIncident(
    report
  ) {
    navigate(
      `/responder/missions/${report.id}`,
      {
        state: {
          returnTo:
            `${location.pathname}${location.search}`,
        },
      }
    );
  }

  return (
    <div className="fixed inset-0 z-[90] flex h-[100dvh] flex-col overflow-hidden bg-resqnow-canvas">

      {/* ============ TOP BAR ============ */}

      <header className="shrink-0 border-b border-resqnow-border-soft bg-white px-3 py-2.5 shadow-sm">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3">

          <button
            type="button"
            onClick={
              goBack
            }
            aria-label="Back to Missions"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-resqnow-border-soft bg-white text-resqnow-primary"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-resqnow-violet">
              Missions
            </p>

            <h1 className="truncate text-[16px] font-extrabold text-resqnow-primary">
              Assigned incident map
            </h1>

            <p className="mt-0.5 text-[10px] text-resqnow-muted">
              {
                filtered.length
              } assigned
              {' · '}
              {
                mappedCount
              } mapped
            </p>
          </div>

          <button
            type="button"
            onClick={
              load
            }
            disabled={
              isLoading
            }
            aria-label="Refresh assigned map"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-resqnow-border-soft bg-white text-resqnow-violet disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isLoading
                  ? 'animate-spin'
                  : ''
              }`}
            />
          </button>

        </div>
      </header>


      {/* ============ ERROR ============ */}

      {error && (
        <div
          className="mx-3 mt-2 shrink-0 rounded-xl border border-resqnow-critical/20 bg-white px-3 py-2.5 shadow-sm"
          role="status"
        >
          <div className="flex items-start gap-2.5 text-[11px] text-resqnow-crimson">

            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

            <div>
              <p className="font-bold">
                Unable to refresh map
              </p>

              <p className="mt-0.5 text-resqnow-muted">
                {error}
              </p>
            </div>

          </div>
        </div>
      )}


      {/* ============ FULL MAP ============ */}

      <main className="flex-1 min-h-0 overflow-hidden p-2 sm:p-3">

        <div className="mx-auto h-full min-h-0 w-full max-w-6xl overflow-hidden rounded-2xl border border-resqnow-border-soft bg-white shadow-[0_8px_28px_rgba(31,29,71,.08)]">

          {isLoading &&
          !reports.length ? (
            <div className="h-full w-full animate-pulse bg-resqnow-canvas" />
          ) : (
            <ResponderAssignedMap
              reports={
                filtered
              }
              onSelect={
                openIncident
              }
              fill
              interactive
              showLegend={
                false
              }
              ariaLabel="Full-screen assigned incident map"
            />
          )}

        </div>

      </main>
 </div>
  );
}