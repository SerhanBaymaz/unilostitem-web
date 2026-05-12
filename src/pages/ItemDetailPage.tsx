import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  PackageSearch,
  Pencil,
  Trash2,
  User,
  XCircle,
} from 'lucide-react';
import { type FormEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/features/auth/store/authStore';
import { ClaimForm } from '@/features/claims/components';
import {
  useAdminReviewClaim,
  useClaimsByItem,
  useCreateClaim,
  useRespondToClaim,
} from '@/features/claims/hooks';
import { useDeleteItem, useItem } from '@/features/items/hooks';
import type { MapMarkerData } from '@/shared/components';
import {
  AppMap,
  CategoryBadge,
  ClaimStatusBadge,
  ItemDetailSkeleton,
  ItemStatusBadge,
  ItemTypeBadge,
  Timeline,
  type TimelineEntry,
} from '@/shared/components';

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function ItemDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showRespondDialog, setShowRespondDialog] = useState(false);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [isApprovedAction, setIsApprovedAction] = useState(false);
  const [comment, setComment] = useState('');

  const { data: item, isLoading, error } = useItem(id ?? '');
  const { data: claimsData } = useClaimsByItem(id ?? '');
  const deleteMutation = useDeleteItem();
  const createClaimMutation = useCreateClaim();
  const reviewMutation = useAdminReviewClaim(selectedClaimId ?? '');
  const respondMutation = useRespondToClaim(selectedClaimId ?? '');

  const isOwner = user && item && user.id === item.ownerId;
  const isAdmin = user?.role === 'Admin';

  const timelineEntries = useMemo<TimelineEntry[]>(() => {
    if (!item) return [];

    const entries: TimelineEntry[] = [
      {
        date: item.createdAt,
        actor: item.ownerName,
        description: t('items.createSuccess'),
        status: 'ApprovedByOwner',
      },
    ];

    if (claimsData?.claims) {
      for (const claim of claimsData.claims) {
        entries.push({
          date: claim.createdAt,
          actor: claim.claimantName,
          description: claim.description,
          status: claim.status,
        });
      }
    }

    return entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [item, claimsData, t]);

  const mapMarker: MapMarkerData | null =
    item?.latitude && item.longitude
      ? {
          id: item.id,
          latitude: item.latitude,
          longitude: item.longitude,
          title: item.title,
          itemType: item.itemType,
          imageUrl: item.imageUrl,
          category: item.category,
          locationLabel: item.locationLabel,
        }
      : null;

  const handleDelete = () => {
    deleteMutation.mutate(id ?? '', {
      onSuccess: () => {
        navigate(isAdmin ? '/admin/items' : '/');
      },
    });
  };

  const handleClaimSubmit = (data: { description: string }) => {
    if (!id) return;
    createClaimMutation.mutate(
      {
        lostItemId: id,
        description: data.description,
      },
      {
        onSuccess: () => {
          setShowClaimDialog(false);
        },
      }
    );
  };

  const handleAdminReview = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedClaimId) return;
    reviewMutation.mutate(
      {
        isApproved: isApprovedAction,
        adminNote: comment || undefined,
      },
      {
        onSuccess: () => {
          setShowReviewDialog(false);
          setSelectedClaimId(null);
          setComment('');
        },
      }
    );
  };

  const handleOwnerRespond = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedClaimId) return;
    respondMutation.mutate(
      {
        isApproved: isApprovedAction,
        responseDescription: comment || undefined,
      },
      {
        onSuccess: () => {
          setShowRespondDialog(false);
          setSelectedClaimId(null);
          setComment('');
        },
      }
    );
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  if (isLoading) return <ItemDetailSkeleton />;

  if (error || !item) {
    return (
      <div className="flex min-h-[60svh] flex-col items-center justify-center gap-4 px-4 text-center">
        <PackageSearch className="h-16 w-16 text-stone-300 dark:text-stone-600" />
        <p className="text-stone-500 dark:text-stone-400">{t('common.noResults')}</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.back')}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-xl p-4 md:p-6 lg:p-8">
      {/* Header Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="-ml-2 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-50"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          {t('common.back')}
        </Button>
        <div className="flex items-center gap-2">
          <ItemStatusBadge status={item.status} />
          <CategoryBadge category={item.category} className="px-4 py-1.5 text-[11px]" />
          <ItemTypeBadge type={item.itemType} />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Image & Map */}
        <div className="space-y-6 lg:col-span-7">
          {/* Image Card */}
          <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-100 border border-stone-200 shadow-warm-1 transition-all duration-500 hover:shadow-warm-2 dark:bg-stone-800 dark:border-stone-700">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <PackageSearch className="h-24 w-24 text-stone-200 dark:text-stone-600" />
              </div>
            )}
            <div className="absolute bottom-4 left-4">
              <span className="rounded-lg bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                {t(`items.${item.status.toLowerCase()}`)}
              </span>
            </div>
          </div>

          {/* Map Card */}
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-warm-1 dark:border-stone-700 dark:bg-card">
            <div className="border-b border-stone-100 px-6 py-4 dark:border-stone-800">
              <h2 className="font-heading text-lg text-stone-900 flex items-center gap-2 dark:text-stone-50">
                <MapPin className="h-5 w-5 text-amber-500" />
                {t('items.locationInfo')}
              </h2>
            </div>
            <div className="h-[300px] w-full">
              {mapMarker ? (
                <AppMap
                  center={[mapMarker.latitude, mapMarker.longitude]}
                  zoom={15}
                  markers={[mapMarker]}
                  className="h-full w-full"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-stone-50 text-stone-400 dark:bg-stone-900 dark:text-stone-500">
                  <MapPin className="mb-2 h-8 w-8 text-stone-200 dark:text-stone-600" />
                  {t('items.noLocation')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Info & Actions */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-warm-1 sm:p-8 dark:border-stone-700 dark:bg-card">
            <h1 className="mb-4 font-heading text-3xl font-bold leading-tight tracking-tight text-stone-900 md:text-4xl dark:text-stone-50">
              {item.title}
            </h1>

            <div className="mb-8 space-y-6">
              {/* Description Section */}
              {item.description && (
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-stone-400">
                    {t('items.description')}
                  </Label>
                  <p className="text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">
                    {item.description}
                  </p>
                </div>
              )}

              {/* Vertical Detail List */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4 rounded-xl bg-stone-50 p-4 border border-stone-100/50 dark:bg-stone-800/50 dark:border-stone-700/50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-stone-700">
                    <User className="h-5 w-5 text-stone-400 dark:text-stone-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      {t('items.reportedBy')}
                    </p>
                    <p className="text-[15px] font-semibold text-stone-700 dark:text-stone-300">
                      {item.ownerName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl bg-stone-50 p-4 border border-stone-100/50 dark:bg-stone-800/50 dark:border-stone-700/50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-stone-700">
                    <Calendar className="h-5 w-5 text-stone-400 dark:text-stone-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      {t('items.incidentDate')}
                    </p>
                    <p className="text-[15px] font-semibold text-stone-700 dark:text-stone-300">
                      {formatDate(item.incidentDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl bg-stone-50 p-4 border border-stone-100/50 dark:bg-stone-800/50 dark:border-stone-700/50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-stone-700">
                    <MessageSquare className="h-5 w-5 text-stone-400 dark:text-stone-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      {t('claims.title')}
                    </p>
                    <p className="text-[15px] font-semibold text-stone-700 dark:text-stone-300">
                      {item.claimCount || 0} Talep
                    </p>
                  </div>
                </div>

                {item.locationLabel && (
                  <div className="flex items-center gap-4 rounded-xl bg-stone-50 p-4 border border-stone-100/50 dark:bg-stone-800/50 dark:border-stone-700/50">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-stone-700">
                      <MapPin className="h-5 w-5 text-stone-400 dark:text-stone-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        {t('items.location')}
                      </p>
                      <p className="text-[15px] font-semibold text-stone-700 leading-snug dark:text-stone-300">
                        {item.locationLabel}
                      </p>
                    </div>
                  </div>
                )}

                {item.contactInfo && (
                  <div className="flex items-center gap-4 rounded-xl bg-stone-50 p-4 border border-stone-100/50 dark:bg-stone-800/50 dark:border-stone-700/50">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-stone-700">
                      <Clock className="h-5 w-5 text-stone-400 dark:text-stone-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        İletişim
                      </p>
                      <p className="text-[15px] font-semibold text-stone-700 dark:text-stone-300">
                        {item.contactInfo}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Primary Actions */}
            <div className="space-y-3">
              {isOwner || isAdmin ? (
                <div className="flex gap-3">
                  {isOwner && (
                    <Button
                      variant="outline"
                      className="h-12 flex-1 rounded-xl font-semibold border-stone-200 dark:border-stone-700"
                      render={<Link to={`/items/${item.id}/edit`} />}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      {t('common.edit')}
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    className="h-12 flex-1 rounded-xl font-semibold"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('common.delete')}
                  </Button>
                </div>
              ) : !isAuthenticated ? (
                <Button
                  size="lg"
                  className="h-14 w-full rounded-xl text-md font-bold shadow-lg shadow-amber-500/20"
                  onClick={() => navigate('/login')}
                >
                  {t('nav.login')} & {t('items.claimItem')}
                </Button>
              ) : (
                <Button
                  className="h-14 w-full rounded-xl text-md font-bold shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                  size="lg"
                  onClick={() => setShowClaimDialog(true)}
                  disabled={item.status !== 'Active'}
                >
                  {item.status === 'Active'
                    ? t('items.claimItem')
                    : t(`items.${item.status.toLowerCase()}`)}
                </Button>
              )}
            </div>
          </div>

          {/* Timeline & Claims Card */}
          <div className="rounded-2xl border border-stone-200 bg-white shadow-warm-1 overflow-hidden dark:border-stone-700 dark:bg-card">
            <div className="border-b border-stone-100 bg-stone-50/50 px-6 py-4 flex items-center justify-between dark:border-stone-800 dark:bg-stone-800/50">
              <h2 className="font-heading text-lg text-stone-900 flex items-center gap-2 dark:text-stone-50">
                <Clock className="h-5 w-5 text-stone-400" />
                {t('claims.timeline')}
              </h2>
            </div>
            <div className="p-6">
              <Timeline entries={timelineEntries} />
            </div>

            {(isAdmin || isOwner) && claimsData?.claims && claimsData.claims.length > 0 && (
              <div className="border-t border-stone-100 p-6 space-y-4 dark:border-stone-800">
                <h3 className="font-heading text-md text-stone-900 font-bold uppercase tracking-tight dark:text-stone-50">
                  {isAdmin ? t('admin.claims') : 'Gelen Talepler'}
                </h3>
                <div className="space-y-4">
                  {claimsData.claims.map((claim) => (
                    <div
                      key={claim.id}
                      className="flex flex-col gap-3 rounded-xl border border-stone-100 bg-stone-50/50 p-4 transition-colors hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-800/50 dark:hover:bg-stone-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-white border border-stone-200 flex items-center justify-center shadow-sm dark:bg-stone-700 dark:border-stone-600">
                            <User className="h-4 w-4 text-stone-400 dark:text-stone-500" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-stone-900 dark:text-stone-50">
                              {claim.claimantName}
                            </p>
                            <p className="text-[11px] text-stone-400">
                              {formatDate(claim.createdAt)}
                            </p>
                          </div>
                        </div>
                        <ClaimStatusBadge status={claim.status} />
                      </div>
                      <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                        {claim.description}
                      </p>
                      {claim.status === 'Pending' && (
                        <div className="flex gap-2 pt-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 flex-1 rounded-lg text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-400"
                            onClick={() => {
                              setSelectedClaimId(claim.id);
                              setIsApprovedAction(true);
                              if (isAdmin) setShowReviewDialog(true);
                              else setShowRespondDialog(true);
                            }}
                          >
                            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                            {t('claims.approve')}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 flex-1 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                            onClick={() => {
                              setSelectedClaimId(claim.id);
                              setIsApprovedAction(false);
                              if (isAdmin) setShowReviewDialog(true);
                              else setShowRespondDialog(true);
                            }}
                          >
                            <XCircle className="mr-1.5 h-4 w-4" />
                            {t('claims.reject')}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t('items.deleteItem')}</DialogTitle>
            <DialogDescription>{t('items.deleteConfirm')}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <DialogClose render={<Button variant="outline" className="rounded-xl" />}>
              {t('common.cancel')}
            </DialogClose>
            <Button
              variant="destructive"
              className="rounded-xl"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? t('common.loading') : t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t('claims.createClaim')}</DialogTitle>
            <DialogDescription>{t('claims.descriptionPlaceholder')}</DialogDescription>
          </DialogHeader>
          <ClaimForm onSubmit={handleClaimSubmit} isPending={createClaimMutation.isPending} />
        </DialogContent>
      </Dialog>

      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{isApprovedAction ? t('claims.approve') : t('claims.reject')}</DialogTitle>
            <DialogDescription>{t('admin.reviewDescription')}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdminReview} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="admin-note"
                className="text-stone-700 font-semibold dark:text-stone-300"
              >
                {t('claims.adminNote')}
              </Label>
              <Textarea
                id="admin-note"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t('claims.adminNotePlaceholder')}
                rows={3}
                className="rounded-xl border-stone-200 bg-stone-50 dark:border-stone-700 dark:bg-stone-800/50"
              />
            </div>
            <DialogFooter className="gap-2">
              <DialogClose render={<Button variant="outline" className="rounded-xl" />}>
                {t('common.cancel')}
              </DialogClose>
              <Button
                type="submit"
                disabled={reviewMutation.isPending}
                className="rounded-xl"
                variant={isApprovedAction ? 'default' : 'destructive'}
              >
                {isApprovedAction ? t('claims.approve') : t('claims.reject')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showRespondDialog} onOpenChange={setShowRespondDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{isApprovedAction ? t('claims.approve') : t('claims.reject')}</DialogTitle>
            <DialogDescription>{t('claims.responsePlaceholder')}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleOwnerRespond} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="owner-comment"
                className="text-stone-700 font-semibold dark:text-stone-300"
              >
                {t('claims.responseDescription')}
              </Label>
              <Textarea
                id="owner-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t('claims.responsePlaceholder')}
                rows={3}
                className="rounded-xl border-stone-200 bg-stone-50 dark:border-stone-700 dark:bg-stone-800/50"
              />
            </div>
            <DialogFooter className="gap-2">
              <DialogClose render={<Button variant="outline" className="rounded-xl" />}>
                {t('common.cancel')}
              </DialogClose>
              <Button
                type="submit"
                disabled={respondMutation.isPending}
                className="rounded-xl"
                variant={isApprovedAction ? 'default' : 'destructive'}
              >
                {isApprovedAction ? t('claims.approve') : t('claims.reject')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
