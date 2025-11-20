from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Student, StudentGroup
from .serializers import StudentSerializer, StudentGroupSerializer
from .pagination import StudentPageNumberPagination


class StudentGroupViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar StudentGroups.
    
    Permite realizar operaciones CRUD (Create, Read, Update, Delete)
    sobre los grupos de estudiantes.
    """
    queryset = StudentGroup.objects.all()
    serializer_class = StudentGroupSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['name', 'room_number']
    search_fields = ['name', 'room_number']
    ordering_fields = ['name', 'created_at', 'updated_at']
    ordering = ['-created_at']


class StudentViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar Students.
    
    Permite realizar operaciones CRUD (Create, Read, Update, Delete)
    sobre los estudiantes.
    """
    queryset = Student.objects.select_related('group').all()
    serializer_class = StudentSerializer
    pagination_class = StudentPageNumberPagination

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['code', 'email', 'group']
    search_fields = ['full_name', 'code', 'email']
    ordering_fields = ['full_name', 'code', 'email', 'group']
    ordering = ['code']

