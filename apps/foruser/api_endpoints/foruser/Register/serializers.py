from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

from apps.foruser.models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    class Meta:
        model = CustomUser
        fields = "__all__"

    def validate(self, data):
        if data["password1"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords don't match")
        validate_password(data['password1'])
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password1')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user